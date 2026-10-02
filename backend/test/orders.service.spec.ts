import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { OrdersService } from "../src/orders/orders.service";
import { criarPrismaMock, PrismaMock } from "./helpers";

describe("OrdersService", () => {
  let prisma: PrismaMock;
  let service: OrdersService;

  beforeEach(() => {
    prisma = criarPrismaMock();
    // A transação recebe o próprio mock como "tx"
    prisma.$transaction.mockImplementation((fn: (tx: PrismaMock) => unknown) => fn(prisma));
    prisma.order.create.mockImplementation(({ data }: { data: unknown }) => data);
    service = new OrdersService(prisma as never);
  });

  const variante = (preco: string) => ({ id: "v1", sku: "SOLE-X-P", preco: new Prisma.Decimal(preco) });

  it("calcula o total no servidor a partir do preço da variante", async () => {
    prisma.variant.findUnique.mockResolvedValue(variante("159.90"));
    prisma.variant.updateMany.mockResolvedValue({ count: 1 });
    const pedido = await service.create({
      clienteNome: "Ana", clienteEmail: "ana@x.com", items: [{ variantId: "v1", quantidade: 3 }],
    });
    expect((pedido as { total: Prisma.Decimal }).total.toString()).toBe("479.7");
    expect((pedido as { status: string }).status).toBe("AGUARDANDO_PAGAMENTO");
  });

  it("só baixa estoque se houver quantidade suficiente (sem oversell)", async () => {
    prisma.variant.findUnique.mockResolvedValue(variante("10"));
    prisma.variant.updateMany.mockResolvedValue({ count: 0 });
    await expect(
      service.create({ clienteNome: "Ana", clienteEmail: "a@x.com", items: [{ variantId: "v1", quantidade: 2 }] }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.variant.updateMany).toHaveBeenCalledWith({
      where: { id: "v1", estoque: { gte: 2 } },
      data: { estoque: { decrement: 2 } },
    });
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it("rejeita variante inexistente", async () => {
    prisma.variant.findUnique.mockResolvedValue(null);
    await expect(
      service.create({ clienteNome: "Ana", clienteEmail: "a@x.com", items: [{ variantId: "zz", quantidade: 1 }] }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it.each([
    ["AGUARDANDO_PAGAMENTO", "EM_SEPARACAO"],
    ["EM_SEPARACAO", "ENVIADO"],
  ])("avança de %s para %s", async (atual, proximo) => {
    prisma.order.findUnique.mockResolvedValue({ id: "o1", status: atual });
    prisma.order.updateMany.mockResolvedValue({ count: 1 });
    const r = await service.advanceStatus("o1");
    expect(r.status).toBe(proximo);
    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: "o1", status: atual }, data: { status: proximo },
    });
  });

  it("não avança pedido já enviado", async () => {
    prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "ENVIADO" });
    await expect(service.advanceStatus("o1")).rejects.toBeInstanceOf(BadRequestException);
  });

  it("detecta alteração concorrente do status", async () => {
    prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "AGUARDANDO_PAGAMENTO" });
    prisma.order.updateMany.mockResolvedValue({ count: 0 });
    await expect(service.advanceStatus("o1")).rejects.toBeInstanceOf(ConflictException);
  });

  it("pedido inexistente devolve 404", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(service.advanceStatus("nada")).rejects.toBeInstanceOf(NotFoundException);
  });
});

import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { OrdersService } from "../src/orders/orders.service";
import { criarPrismaMock, PrismaMock } from "./helpers";

const OPTIONS = [
  { key: "escopo", label: "Escopo", values: [{ value: "casa", label: "Casa completa" }] },
  { key: "entrega", label: "Entrega", values: [{ value: "express", label: "15 dias" }] },
];

// Variante física (com estoque) ou de serviço (estoque null)
const variante = (preco: string, kind: "PHYSICAL" | "SERVICE", estoque: number | null) => ({
  id: "v1",
  sku: "XPTO-CASA-EXPRESS",
  preco: new Prisma.Decimal(preco),
  estoque,
  attributes: { escopo: "casa", entrega: "express" },
  product: { nome: "XPTO", kind, options: OPTIONS },
});

const pedido = (extra: Record<string, unknown> = {}) => ({
  clienteNome: "Ana",
  clienteEmail: "ana@x.com",
  items: [{ variantId: "v1", quantidade: 1 }],
  ...extra,
});

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

  describe("criação", () => {
    it("calcula o total no servidor a partir do preço da variante e nasce NOVO", async () => {
      prisma.variant.findUnique.mockResolvedValue(variante("159.90", "PHYSICAL", 10));
      prisma.variant.updateMany.mockResolvedValue({ count: 1 });
      const r = (await service.create(pedido({ items: [{ variantId: "v1", quantidade: 3 }] }))) as {
        total: Prisma.Decimal;
        status: string;
        fulfillmentType: string;
      };
      expect(r.total.toString()).toBe("479.7");
      expect(r.status).toBe("NOVO");
      expect(r.fulfillmentType).toBe("PHYSICAL");
    });

    it("produto físico: só baixa estoque se houver quantidade suficiente (sem oversell)", async () => {
      prisma.variant.findUnique.mockResolvedValue(variante("10", "PHYSICAL", 1));
      prisma.variant.updateMany.mockResolvedValue({ count: 0 });
      await expect(
        service.create(pedido({ items: [{ variantId: "v1", quantidade: 2 }] })),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.variant.updateMany).toHaveBeenCalledWith({
        where: { id: "v1", estoque: { gte: 2 } },
        data: { estoque: { decrement: 2 } },
      });
      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it("serviço (estoque null): não mexe em estoque e marca o pedido como SERVICE", async () => {
      prisma.variant.findUnique.mockResolvedValue(variante("2900", "SERVICE", null));
      const r = (await service.create(pedido({ clienteWhatsapp: "5581999990000" }))) as { fulfillmentType: string; total: Prisma.Decimal };
      expect(prisma.variant.updateMany).not.toHaveBeenCalled();
      expect(r.fulfillmentType).toBe("SERVICE");
      expect(r.total.toString()).toBe("2900");
    });

    it("guarda um snapshot legível do item e os dados de contato", async () => {
      prisma.variant.findUnique.mockResolvedValue(variante("2900", "SERVICE", null));
      // O mock de order.create devolve o próprio `data`, então os itens vêm em `items.create`
      const r = (await service.create(
        pedido({ clienteWhatsapp: "5581999990000", clienteMensagem: "Prefiro de manhã" }),
      )) as unknown as { items: { create: Array<{ descricao: string }> }; clienteWhatsapp: string; clienteMensagem: string };
      expect(r.items.create[0].descricao).toBe("XPTO · Casa completa · 15 dias");
      expect(r.clienteWhatsapp).toBe("5581999990000");
      expect(r.clienteMensagem).toBe("Prefiro de manhã");
    });

    it("serviço sem WhatsApp é recusado antes de qualquer escrita", async () => {
      prisma.variant.findUnique.mockResolvedValue(variante("2900", "SERVICE", null));
      await expect(service.create(pedido())).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.variant.updateMany).not.toHaveBeenCalled();
      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it("produto físico continua aceitando pedido sem WhatsApp", async () => {
      prisma.variant.findUnique.mockResolvedValue(variante("10", "PHYSICAL", 3));
      prisma.variant.updateMany.mockResolvedValue({ count: 1 });
      await expect(service.create(pedido())).resolves.toBeTruthy();
    });

    it("recusa físico e serviço no mesmo pedido", async () => {
      prisma.variant.findUnique
        .mockResolvedValueOnce(variante("10", "PHYSICAL", 5))
        .mockResolvedValueOnce({ ...variante("20", "SERVICE", null), id: "v2" });
      prisma.variant.updateMany.mockResolvedValue({ count: 1 });
      await expect(
        service.create(pedido({ items: [{ variantId: "v1", quantidade: 1 }, { variantId: "v2", quantidade: 1 }] })),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it("rejeita variante inexistente", async () => {
      prisma.variant.findUnique.mockResolvedValue(null);
      await expect(
        service.create(pedido({ items: [{ variantId: "zz", quantidade: 1 }] })),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("status", () => {
    it.each([
      ["NOVO", "EM_CONTATO"],
      ["EM_CONTATO", "CONFIRMADO"],
      ["CONFIRMADO", "CONCLUIDO"],
    ])("avança de %s para %s", async (atual, proximo) => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: atual });
      prisma.order.updateMany.mockResolvedValue({ count: 1 });
      const r = await service.advanceStatus("o1");
      expect(r.status).toBe(proximo);
      expect(prisma.order.updateMany).toHaveBeenCalledWith({
        where: { id: "o1", status: atual },
        data: { status: proximo },
      });
    });

    it.each(["CONCLUIDO", "CANCELADO"])("não avança pedido em estado final (%s)", async (estado) => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: estado });
      await expect(service.advanceStatus("o1")).rejects.toBeInstanceOf(BadRequestException);
    });

    it.each(["NOVO", "EM_CONTATO", "CONFIRMADO"])("cancela a partir de %s", async (estado) => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: estado });
      prisma.order.updateMany.mockResolvedValue({ count: 1 });
      const r = await service.cancel("o1");
      expect(r.status).toBe("CANCELADO");
    });

    it.each(["CONCLUIDO", "CANCELADO"])("não cancela pedido em estado final (%s)", async (estado) => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: estado });
      await expect(service.cancel("o1")).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.order.updateMany).not.toHaveBeenCalled();
    });

    it("detecta alteração concorrente do status", async () => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "NOVO" });
      prisma.order.updateMany.mockResolvedValue({ count: 0 });
      await expect(service.advanceStatus("o1")).rejects.toBeInstanceOf(ConflictException);
    });

    it("pedido inexistente devolve 404", async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.advanceStatus("nada")).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

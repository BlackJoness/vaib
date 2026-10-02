import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/app.setup";
import { PrismaService } from "../src/prisma/prisma.service";

export const JWT_SECRET_TESTE = "segredo-de-teste-com-mais-de-32-caracteres!!";

// Prisma simulado: cada teste define só o que precisa.
export function criarPrismaMock() {
  return {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $queryRaw: jest.fn().mockResolvedValue([{ "?column?": 1 }]),
    $transaction: jest.fn(),
    adminUser: { findUnique: jest.fn() },
    product: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn() },
    variant: { findUnique: jest.fn(), findMany: jest.fn().mockResolvedValue([]), updateMany: jest.fn() },
    order: { findUnique: jest.fn(), updateMany: jest.fn(), create: jest.fn() },
    orderItem: { groupBy: jest.fn().mockResolvedValue([]) },
  };
}
export type PrismaMock = ReturnType<typeof criarPrismaMock>;

export async function criarApp(prisma: PrismaMock): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();
  const app = configureApp(moduleRef.createNestApplication());
  await app.init();
  return app;
}

export function tokenAdmin(app: INestApplication, overrides: Record<string, unknown> = {}) {
  return app.get(JwtService).sign({ sub: "admin-1", email: "admin@sole.dev", role: "admin", ...overrides });
}

import { INestApplication, ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { PrismaExceptionFilter } from "./common/prisma-exception.filter";

// Configuração HTTP compartilhada entre main.ts e os testes,
// para que os testes exercitem exatamente o que roda em produção.
export function configureApp(app: INestApplication) {
  const express = app as NestExpressApplication;

  // Render/Vercel ficam atrás de proxy: sem isso, o limite de requisições
  // contaria todos os clientes como um só IP (o do proxy).
  express.set("trust proxy", 1);
  express.disable("x-powered-by");

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // erro se enviarem campos extras
      transform: true, // converte tipos (string → number, etc.)
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  const origens = (process.env.FRONTEND_URL ?? "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origens,
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 600,
  });

  app.enableShutdownHooks();
  return app;
}

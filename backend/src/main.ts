import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global de todos os payloads de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // erro se enviarem campos extras
      transform: true, // converte tipos (string → number, etc.)
    }),
  );

  app.enableCors({
    origin: (process.env.FRONTEND_URL ?? "http://localhost:3000").split(","),
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

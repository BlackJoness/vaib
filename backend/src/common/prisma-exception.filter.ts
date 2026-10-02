import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Response } from "express";

// Traduz erros conhecidos do Prisma em respostas HTTP corretas
// sem vazar detalhes do banco (tabela, coluna, query) para o cliente.
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const mapa: Record<string, [number, string]> = {
      P2002: [HttpStatus.CONFLICT, "Registro duplicado"],
      P2025: [HttpStatus.NOT_FOUND, "Registro não encontrado"],
      P2003: [HttpStatus.BAD_REQUEST, "Referência inválida"],
    };
    const [status, message] = mapa[exception.code] ?? [
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Erro interno",
    ];

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Prisma ${exception.code}: ${exception.message}`);
    }
    res.status(status).json({ statusCode: status, message });
  }
}

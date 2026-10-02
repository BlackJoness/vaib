import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "./public.decorator";

export type AdminJwtPayload = { sub: string; email: string; role: "admin" };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request & { admin?: AdminJwtPayload }>();
    const token = this.extrairToken(req);
    if (!token) throw new UnauthorizedException("Token ausente");

    try {
      const payload = await this.jwt.verifyAsync<AdminJwtPayload>(token, {
        algorithms: ["HS256"],
      });
      if (payload.role !== "admin") throw new Error("papel inválido");
      req.admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Token inválido ou expirado");
    }
  }

  private extrairToken(req: Request): string | undefined {
    const [tipo, token] = req.headers.authorization?.split(" ") ?? [];
    return tipo === "Bearer" && token ? token : undefined;
  }
}

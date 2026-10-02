import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import type { AdminJwtPayload } from "./jwt-auth.guard";

export const BCRYPT_ROUNDS = 12;

// Hash real de um valor aleatório, gerado uma vez na subida. Quando o e-mail
// não existe, a senha é comparada com ele mesmo assim: a resposta leva o mesmo
// tempo e não revela quais e-mails pertencem a um admin.
const HASH_FALSO = bcrypt.hashSync(`inexistente-${Math.random()}`, BCRYPT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    const senhaOk = await bcrypt.compare(senha, admin?.senhaHash ?? HASH_FALSO);
    if (!admin || !senhaOk) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const payload: AdminJwtPayload = { sub: admin.id, email: admin.email, role: "admin" };
    return { accessToken: await this.jwt.signAsync(payload), tokenType: "Bearer" };
  }
}

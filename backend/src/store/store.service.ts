import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface StoreInfo {
  nome: string;
  whatsapp: string | null;
  email: string | null;
}

// Identidade pública da loja, lida do ambiente (validado em env.validation.ts).
// Só estes três campos saem daqui: nada mais do ambiente é exposto.
@Injectable()
export class StoreService {
  constructor(private readonly config: ConfigService) {}

  info(): StoreInfo {
    return {
      nome: this.config.getOrThrow<string>("STORE_NAME"),
      whatsapp: this.config.get<string>("STORE_WHATSAPP") ?? null,
      email: this.config.get<string>("STORE_EMAIL") ?? null,
    };
  }
}

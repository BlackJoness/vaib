import { SetMetadata } from "@nestjs/common";

// Toda rota exige token por padrão (guard global).
// Só o que for marcado com @Public() fica aberto.
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

import type { ComponentType } from "react";
import type { SectionKey } from "./store-config.schema";
import type { SectionProps } from "@/components/sections/types";
import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import Beneficios from "@/components/sections/Beneficios";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Oferta from "@/components/sections/Oferta";
import ProvaSocial from "@/components/sections/ProvaSocial";
import Faq from "@/components/sections/Faq";
import CtaFinal from "@/components/sections/CtaFinal";
import Newsletter from "@/components/Newsletter";

/**
 * Registro chave → componente. A ordem na página vem de storeConfig.sections;
 * uma seção sem conteúdo no produto se esconde sozinha (retorna null).
 */
export const SECTIONS: Record<SectionKey, ComponentType<SectionProps>> = {
  hero: Hero,
  showcase: Showcase,
  beneficios: Beneficios,
  comoFunciona: ComoFunciona,
  oferta: Oferta,
  provaSocial: ProvaSocial,
  faq: Faq,
  ctaFinal: CtaFinal,
  newsletter: Newsletter,
};

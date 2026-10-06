import type { Product } from "@/lib/types";

/** Toda seção da home recebe o produto em destaque (API ou fallback). */
export type SectionProps = { produto: Product };

import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { ProductsService } from "./products.service";

// Catálogo é público: a loja lê sem login.
@Public()
@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll() {
    return this.products.findAll();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.products.findBySlug(slug);
  }
}

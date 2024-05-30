import { Result } from "@soapjs/soap";
import { inject, injectable } from "inversify";
import { ListProductsOptions } from "./types";
import { Product } from "./entities/product";
import { CreateProductsUseCase } from "./use-cases/create-products.use-case";
import { GetProductByIdUseCase } from "./use-cases/get-product-by-id.use-case";
import { GetProductsByProducerIdUseCase } from "./use-cases/get-products-by-producer-id.use-case";
import { RemoveProductsUseCase } from "./use-cases/remove-products.use-case";
import { UpdateProductUseCase } from "./use-cases/update-product.use-case";

@injectable()
export class ProductsController {
  static Token = "ProductsController";

  constructor(
    @inject(CreateProductsUseCase.Token)
    private createProductsUseCase: CreateProductsUseCase,
    @inject(UpdateProductUseCase.Token)
    private updateProductUseCase: UpdateProductUseCase,
    @inject(GetProductByIdUseCase.Token)
    private getProductByIdUseCase: GetProductByIdUseCase,
    @inject(GetProductsByProducerIdUseCase.Token)
    private getProductsByProducerIdUseCase: GetProductsByProducerIdUseCase,
    @inject(RemoveProductsUseCase.Token)
    private removeProductsUseCase: RemoveProductsUseCase
  ) {}

  async list(
    options: ListProductsOptions
  ): Promise<Result<Product | Product[]>> {
    if (options.id && options.producerId) {
      return Result.withFailure(
        new Error("Please use either id or producerId")
      );
    }

    if (options.id) {
      return this.getProductByIdUseCase.execute(options.id);
    }

    return this.getProductsByProducerIdUseCase.execute(options.producerId);
  }

  async create(products: Product[]): Promise<Result<Product[]>> {
    return this.createProductsUseCase.execute(products);
  }

  async update(product: Product): Promise<Result<Product>> {
    return this.updateProductUseCase.execute(product);
  }

  async delete(ids: string[]): Promise<Result<boolean>> {
    return this.removeProductsUseCase.execute(ids);
  }
}

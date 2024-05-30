import * as Soap from "@soapjs/soap";
import { Product } from "../entities/product";
import { inject, injectable } from "inversify";
import { ProductRepository } from "../repositories/product.repository";

@injectable()
export class UpdateProductUseCase implements Soap.UseCase<Product> {
  static Token = "UpdateProductUseCase";

  constructor(
    @inject(ProductRepository.Token)
    private productRepository: ProductRepository
  ) {}

  async execute(product: Product): Promise<Soap.Result<Product>> {
    const result = await this.productRepository.update({
      updates: [product],
      where: [new Soap.Where().valueOf("id").isEq(product.id)],
      methods: [0],
    });

    if (result.isFailure) {
      return Soap.Result.withFailure(result.failure);
    }

    return Soap.Result.withContent(product);
  }
}

import * as Soap from "@soapjs/soap";
import { inject, injectable } from "inversify";
import { ProductRepository } from "../repositories/product.repository";
import { Product } from "../entities/product";
import { AssignProducersUseCase } from "./assign-producers.use-case";

@injectable()
export class CreateProductsUseCase implements Soap.UseCase<Product[]> {
  static Token = "CreateProductsUseCase";

  constructor(
    @inject(ProductRepository.Token)
    private productRepository: ProductRepository,
    @inject(AssignProducersUseCase.Token)
    private assignProducersUseCase: AssignProducersUseCase
  ) {}

  async execute(products: Product[]): Promise<Soap.Result<Product[]>> {
    const result = await this.productRepository.add(products);

    if (result.isFailure) {
      return Soap.Result.withFailure(result.failure);
    }

    const mergeResult = await this.assignProducersUseCase.execute(
      result.content
    );

    if (mergeResult.isFailure) {
      return Soap.Result.withContent(result.content);
    }

    return Soap.Result.withContent(mergeResult.content);
  }
}

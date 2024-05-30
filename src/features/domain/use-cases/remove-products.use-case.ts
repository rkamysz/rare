import * as Soap from "@soapjs/soap";
import { inject, injectable } from "inversify";
import { ProductRepository } from "../repositories/product.repository";

@injectable()
export class RemoveProductsUseCase implements Soap.UseCase<boolean> {
  static Token = "RemoveProductsUseCase";

  constructor(
    @inject(ProductRepository.Token)
    private productRepository: ProductRepository
  ) {}

  async execute(ids: string[]): Promise<Soap.Result<boolean>> {
    const result = await this.productRepository.remove({
      where: new Soap.Where().valueOf("id").isIn(ids),
    });

    if (result.isFailure) {
      return Soap.Result.withFailure(result.failure);
    }

    return Soap.Result.withContent(true);
  }
}

import * as Soap from "@soapjs/soap";
import { inject, injectable } from "inversify";
import { Product } from "../entities/product";
import { ProducerRepository } from "../repositories/producer.repository";
import { Producer } from "../entities/producer";

@injectable()
export class AssignProducersUseCase implements Soap.UseCase<Product[]> {
  static Token = "AssignProducersUseCase";

  constructor(
    @inject(ProducerRepository.Token)
    private producerRepository: ProducerRepository
  ) {}

  async execute(products: Product[]): Promise<Soap.Result<Product[]>> {
    const producerIds = new Set();

    products.forEach((product) => {
      producerIds.add(product.producerId);
    });

    const getProducersResult = await this.producerRepository.find({
      where: new Soap.Where().valueOf("id").isIn(Array.from(producerIds)),
    });

    let producers: Producer[];
    if (getProducersResult.isFailure) {
      // log issue?
    } else {
      producers = getProducersResult.content;
    }

    const productsWithProducers = products.map((product) => {
      const producer = producers.find((p) => p.id === product.producerId);
      if (producer) {
        product.addProducerDetails(producer);
      }
      return product;
    });

    return Soap.Result.withContent(productsWithProducers);
  }
}

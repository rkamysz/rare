import { Producer } from "./producer";

export class Product {
  private _producer: Producer;
  constructor(
    public readonly id: string,
    public readonly vintage: string,
    public readonly name: string,
    public readonly producerId: string,
    public readonly colour?: string,
    public readonly quantity?: number,
    public readonly format?: string,
    public readonly priceGBP?: number,
    public readonly duty?: string,
    public readonly availability?: string,
    public readonly conditions?: string,
    public readonly imageUrl?: string
  ) {}

  addProducerDetails(producer: Producer) {
    this._producer = producer;
  }

  get producer(): Producer {
    return this._producer;
  }
}

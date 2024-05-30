export interface ProducerModel {
  _id: string;
  name: string;
  country: string;
  region: string;
}

export interface ProductModel {
  _id: string;
  vintage: string;
  name: string;
  producerId: string;
}

export interface ProductWithProducerModel extends ProductModel {
  producer: ProducerModel;
}

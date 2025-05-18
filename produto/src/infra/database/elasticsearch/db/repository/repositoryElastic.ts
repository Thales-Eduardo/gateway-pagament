import { Client } from "@elastic/elasticsearch";

export class RepositoryElastic {
  private client: Client;
  private indexName: string;

  constructor() {
    this.client = new Client({ node: process.env.ELASTICSEARCH_URL });
    this.indexName = process.env.ELASTICSEARCH_INDEX || "Product";
  }

  public async insertDocument(
    name: string,
    price: number,
    quantity: number
  ): Promise<any> {
    const result = await this.client.index({
      index: this.indexName,
      refresh: true,
      body: {
        name,
        price,
        quantity,
      },
    });
    return result;
  }

  public async updateDocument(
    id: string,
    name: string,
    price: number,
    quantity: number
  ): Promise<void> {
    await this.client.update({
      index: this.indexName,
      id: id,
      refresh: true,
      doc: {
        name,
        price,
        quantity,
      },
    });
  }

  public async deleteDocument(id: string) {
    const exists = await this.client.exists({
      index: this.indexName,
      id,
    });

    if (exists) {
      await this.client.delete({
        index: this.indexName,
        id,
      });
    }
  }

  public async findAll() {
    const response = await this.client.search({
      index: this.indexName,
      size: 100,
      query: {
        match_all: {},
      },
    });

    return response.hits.hits.map((hit) => ({
      id: hit._id,
      ...(hit._source as Record<string, any>),
    }));
  }

  public async findName(name: string) {
    const response = await this.client.search({
      index: this.indexName,
      size: 100,
      query: {
        match: {
          name: name, // busca por nome (com análise linguística)
        },
      },
    });

    return response.hits.hits.map((hit) => ({
      id: hit._id,
      name: (hit._source as { name: string })?.name,
      price: (hit._source as { price: number })?.price,
      quantity: (hit._source as { quantity: number })?.quantity,
    }));
  }

  public async findById(id: string) {
    const response: any = await this.client.get({
      index: this.indexName,
      id: id,
    });

    return {
      _id: response._id,
      ...response._source,
    };
  }
}

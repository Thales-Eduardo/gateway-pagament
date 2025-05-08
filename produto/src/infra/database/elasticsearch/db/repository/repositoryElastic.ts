import { Client } from "@elastic/elasticsearch";

export class RepositoryElastic {
  private client: Client;
  private indexName: string;

  constructor() {
    this.client = new Client({ node: process.env.ELASTICSEARCH_URL });
    this.indexName = process.env.ELASTICSEARCH_INDEX || "products";
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

  public async searchName(name: string) {
    const result = await this.client.search({
      index: this.indexName,
      query: {
        match: {
          name: name,
        },
      },
    });

    return result;
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

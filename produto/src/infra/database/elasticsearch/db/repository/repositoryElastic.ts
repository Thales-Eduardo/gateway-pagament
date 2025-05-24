import { Client } from "@elastic/elasticsearch";

export class RepositoryElastic {
  private client: Client;
  private indexName: string;

  constructor() {
    this.client = new Client({ node: process.env.ELASTICSEARCH_URL });
    this.indexName =
      process.env.ELASTICSEARCH_INDEX_NAME ||
      "mysql-server.micro_payment.product";
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
        wildcard: {
          name: {
            value: `*${name}*`,
            case_insensitive: true,
          },
        },
      },
    });

    return response.hits.hits.map((hit) => ({
      id: (hit._source as { id: string })?.id,
      name: (hit._source as { name: string })?.name,
      price: (hit._source as { price: number })?.price,
      quantity: (hit._source as { quantity: number })?.quantity,
    }));
  }

  public async findById(id: string) {
    const response = await this.client.search({
      index: this.indexName,
      query: {
        term: {
          "id.keyword": id,
        },
      },
    });

    return response.hits.hits.map((hit: any) => ({
      id: hit._id, // Elasticsearch internal _id
      ...hit._source,
    }));
  }
}

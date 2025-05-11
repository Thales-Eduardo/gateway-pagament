import { RepositoryElastic } from "../infra/database/elasticsearch/db/repository/repositoryElastic";

export class GetProductsByNameServicee {
  private database: RepositoryElastic;

  constructor(database: RepositoryElastic) {
    this.database = database;
  }

  async execute(name: string) {
    const products = await this.database.findName(name);
    return products;
  }
}

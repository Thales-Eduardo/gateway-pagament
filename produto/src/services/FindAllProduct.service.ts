import { RepositoryElastic } from "../infra/database/elasticsearch/db/repository/repositoryElastic";

export class FindAllProductService {
  private database: RepositoryElastic;

  constructor(database: RepositoryElastic) {
    this.database = database;
  }

  async execute() {
    const products = await this.database.findAll();
    return products;
  }
}

import { RepositoryElastic } from "../infra/database/elasticsearch/db/repository/repositoryElastic";

export class GetProductsByIdService {
  private database: RepositoryElastic;

  constructor(database: RepositoryElastic) {
    this.database = database;
  }

  async execute(id: string) {
    const product = await this.database.findById(id);
    return product;
  }
}

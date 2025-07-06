import { prismaClient } from "../connection";

export class ReservedProductRepository {
  private readonly prismaClient: typeof prismaClient;

  constructor() {
    this.prismaClient = prismaClient;
  }

  async create(data: any) {
    return this.prismaClient.reservedProduct.create({
      data,
    });
  }

  async findAll() {
    return this.prismaClient.reservedProduct.findMany();
  }

  async findById(id: string) {
    return this.prismaClient.reservedProduct.findUnique({
      where: { id },
    });
  }
}

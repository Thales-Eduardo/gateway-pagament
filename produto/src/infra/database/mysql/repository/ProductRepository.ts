import { prismaClient } from "../connection";

export class ProductRepository {
  private readonly prismaClient: typeof prismaClient;

  constructor() {
    this.prismaClient = prismaClient;
  }

  async create(data: any) {
    return this.prismaClient.product.create({
      data,
    });
  }

  async findAll() {
    return this.prismaClient.product.findMany();
  }

  async findById(id: string) {
    return this.prismaClient.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prismaClient.product.update({
      where: { id },
      data,
    });
  }

  async updateQuantity(id: string, quantity: number) {
    return this.prismaClient.product.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  async delete(id: string) {
    return this.prismaClient.product.delete({
      where: { id },
    });
  }
}

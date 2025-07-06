import { prismaClient } from "./index";
import { StatusPayment } from "./PaymentRepository";

export class ReservedProductRepository {
  private readonly prismaClient: typeof prismaClient;

  constructor() {
    this.prismaClient = prismaClient;
  }

  async updateStatusReservedProduct({
    id,
    status,
  }: {
    id: string;
    status: StatusPayment;
  }): Promise<any> {
    const updatedRecord = await this.prismaClient.reservedProduct.update({
      where: {
        id: id,
      },
      data: { status: status },
    });

    return updatedRecord;
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

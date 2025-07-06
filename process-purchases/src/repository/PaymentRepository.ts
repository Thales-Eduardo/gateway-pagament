import { DateTime } from "luxon";
import { prismaClient } from "./index";

interface RegisterPaymentRequestDTOs {
  produto: {
    product_id: string;
    user_id: string;
    price: number;
    quantity: number;
    total_price: number;
  };

  card: {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_security_code: string;
  };

  data: Date;
}

export enum StatusPayment {
  PENDING,
  PROCESSING,
  AUTHORIZED,
}

export class PaymentRepository {
  private readonly prismaClient: typeof prismaClient;

  constructor() {
    this.prismaClient = prismaClient;
  }

  //melhorar qry at
  async createPaymentRequest({
    produto,
    data,
  }: RegisterPaymentRequestDTOs): Promise<any> {
    const nowBr = DateTime.fromJSDate(data, { zone: "America/Sao_Paulo" });
    const cutoffUtc = nowBr.minus({ minutes: 2 }).toUTC().toJSDate();

    const existing = await this.prismaClient.registerPaymentRequest.findFirst({
      where: {
        user_id: produto.user_id,
        product_id: produto.product_id,
        createdAt: {
          gte: cutoffUtc,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) return false;

    const createdRecord = await this.prismaClient.registerPaymentRequest.create(
      {
        data: {
          user_id: produto.user_id,
          product_id: produto.product_id,
          price: produto.price,
          total_price: produto.total_price,
          quantity: produto.quantity,
          status: StatusPayment.PENDING,
        },
      }
    );

    return {
      id: createdRecord.id,
      value: true,
    };
  }

  async updatePaymentRequest({
    id_transaction,
    status,
  }: {
    id_transaction: string;
    status: StatusPayment;
  }): Promise<any> {
    const updatedRecord = await this.prismaClient.registerPaymentRequest.update(
      {
        where: { id: id_transaction },
        data: { status: status },
      }
    );

    return updatedRecord;
  }

  async createRecordAntiDuplication({
    id_transaction,
    process,
    user_id,
  }: {
    id_transaction: string;
    user_id: string;
    process: boolean;
  }): Promise<string> {
    const createAntDuplication = await this.prismaClient.antiDuplication.create(
      {
        data: {
          id_transaction,
          user_id,
          process: process,
        },
      }
    );

    return createAntDuplication.id_transaction;
  }

  async checkAndUpdateOptimistic({
    id_transaction,
    process,
  }: {
    id_transaction: string;
    process: boolean;
  }): Promise<any> {
    const updateResult = await this.prismaClient.antiDuplication.updateMany({
      where: {
        id_transaction: id_transaction,
      },
      data: {
        process: process, // Atualiza
      },
    });

    // Se retornou 0, o registro já estava como true ou não existe
    // Se atualizou 1 registro, significa que estava false e foi alterado
    return {
      value: updateResult.count === 1 ? true : false,
      id_transaction,
    };
  }

  async updateRetryCount(id_transaction: string): Promise<any> {
    const updated = await this.prismaClient.registerPaymentRequest.update({
      where: {
        id: id_transaction,
      },
      data: {
        retry_count: {
          increment: 1,
        },
      },
    });

    return updated;
  }

  async deleteAntDuplication() {
    await this.prismaClient.antiDuplication.deleteMany();
  }

  async deletePaymentRequest() {
    await this.prismaClient.registerPaymentRequest.deleteMany();
  }

  async findPaymentRequest(id: string) {
    return await this.prismaClient.registerPaymentRequest.findUnique({
      where: { id: id },
    });
  }

  async findAntiDuplication(id_transaction: string) {
    return await this.prismaClient.antiDuplication.findUnique({
      where: { id_transaction: id_transaction },
    });
  }

  async findbyIdProduct(product_id: string) {
    const product = await this.prismaClient.product.findFirst({
      where: {
        id: product_id,
      },
    });

    return product;
  }
}

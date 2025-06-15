import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";

export const prismaClient = new PrismaClient({
  // log: ['query'],
});

interface RegisterPaymentRequestDTOs {
  produto: {
    product_id: string;
    user_id: string;
    price: number;
    quantity: number;
  };

  card: {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_security_code: string;
  };

  data: Date;
}

enum StatusPayment {
  PENDING,
  PROCESSING,
  AUTHORIZED,
}

export class PaymentRepository {
  //melhorar qry at
  async createPaymentRequest({
    produto,
    card,
    data,
  }: RegisterPaymentRequestDTOs): Promise<any> {
    const nowBr = DateTime.fromJSDate(data, { zone: "America/Sao_Paulo" });
    const cutoffUtc = nowBr.minus({ minutes: 2 }).toUTC().toJSDate();

    const existing = await prismaClient.registerPaymentRequest.findFirst({
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

    const createdRecord = await prismaClient.registerPaymentRequest.create({
      data: {
        card_exp_month: card.card_exp_month,
        card_exp_year: card.card_exp_year,
        card_number: card.card_number,
        card_security_code: card.card_security_code,
        user_id: produto.user_id,
        product_id: produto.product_id,
        price: produto.price,
        quantity: produto.quantity,
        status: StatusPayment.PENDING,
      },
    });

    return {
      id: createdRecord.id,
      value: true,
    };
  }

  async createRecordAntiDuplication(
    id_transaction: string,
    user_id: string,
    process: boolean
  ): Promise<string> {
    const createAntDuplication = await prismaClient.antiDuplication.create({
      data: {
        id_transaction,
        user_id,
        process: process,
      },
    });

    return createAntDuplication.id_transaction;
  }

  async checkAndUpdateOptimistic(id_transaction: string): Promise<any> {
    const updateResult = await prismaClient.antiDuplication.updateMany({
      where: {
        id_transaction: id_transaction,
        process: false, // Só atualiza se for false
      },
      data: {
        process: true, // Atualiza para true
      },
    });

    // Se retornou 0, o registro já estava como true ou não existe
    // Se atualizou 1 registro, significa que estava false e foi alterado
    return {
      value: updateResult.count === 1 ? true : false,
      id_transaction,
    };
  }

  async deleteAntDuplication() {
    await prismaClient.antiDuplication.deleteMany();
  }

  async deletePaymentRequest() {
    await prismaClient.registerPaymentRequest.deleteMany();
  }

  async findPaymentRequest(id: string) {
    return await prismaClient.registerPaymentRequest.findUnique({
      where: { id: id },
    });
  }

  async findAntiDuplication(id: string) {
    return await prismaClient.antiDuplication.findUnique({
      where: { id_transaction: id },
    });
  }

  async findbyIdProduct(product_id: string) {
    const product = await prismaClient.product.findFirst({
      where: {
        id: product_id,
      },
    });

    return product;
  }
}

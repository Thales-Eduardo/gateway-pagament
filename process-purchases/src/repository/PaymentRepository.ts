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
  async createPaymentRequest({
    produto,
    card,
    data = new Date(),
  }: RegisterPaymentRequestDTOs): Promise<boolean> {
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

    if (existing === null) return existing === null;

    await prismaClient.registerPaymentRequest.create({
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

    return true;
  }

  // async createRecordAntiDuplication(): Promise<void> {
  //   await prismaClient.antiDuplication.create({
  //     data: {
  //       id_transacao,
  //       user_id,
  //       process,
  //     },
  //   });
  // }
}

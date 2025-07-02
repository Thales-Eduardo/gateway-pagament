import { api } from "./axios";

export interface InterfacePaymentRequestDtos {
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

export async function makePayment(
  payment: InterfacePaymentRequestDtos
): Promise<boolean> {
  const data = await api.post("/", {
    reference_id: payment.produto.user_id,
    description: "Motivo da cobrança",
    amount: {
      value: payment.produto.total_price,
      currency: "BRL",
    },
    payment_method: {
      type: "CREDIT_CARD",
      installments: 1,
      capture: false,
      card: {
        number: payment.card.card_number,
        exp_month: payment.card.card_exp_month,
        exp_year: payment.card.card_exp_year,
        security_code: payment.card.card_security_code,
        holder: {
          name: "Jose da Silva",
        },
      },
    },
  });

  return data.data.status === "AUTHORIZED" ? true : false;
}
// Example usage:
// (async () => {
//   const result = await makePayment();
//   console.log(result);
// })();

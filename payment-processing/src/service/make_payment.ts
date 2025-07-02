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

  anti_duplication?: {
    id: string;
    user_id: string;
    processed: boolean;
  };
}

export async function makePayment(
  payment: InterfacePaymentRequestDtos
): Promise<boolean> {
  const num =
    typeof payment.produto.total_price === "string"
      ? parseFloat(payment.produto.total_price)
      : payment.produto.total_price;

  const fixed = num.toFixed(2);
  const withoutDot = fixed.replace(".", "");
  const formatValue = parseInt(withoutDot, 10);

  const data = await api.post("/", {
    reference_id: payment.produto.user_id,
    description: "Motivo da cobrança",
    amount: {
      value: formatValue,
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

  console.log("Payment response received:", data.data.status);

  return data.data.status === "AUTHORIZED" ? true : false;
}
// Example usage:
// (async () => {
//   const result = await makePayment();
//   console.log(result);
// })();

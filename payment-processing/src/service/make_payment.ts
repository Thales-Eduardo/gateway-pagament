import { api } from "./axios";

export async function makePayment() {
  const data = await api.post("/", {
    reference_id: "ex-00001",
    description: "Motivo da cobrança",
    amount: {
      value: 7171,
      currency: "BRL",
    },
    payment_method: {
      type: "CREDIT_CARD",
      installments: 1,
      capture: false,
      card: {
        number: "4111111111111111",
        exp_month: "03",
        exp_year: "2026",
        security_code: "123",
        holder: {
          name: "Jose da Silva",
        },
      },
    },
  });

  return data.data;
}
// Example usage:
// (async () => {
//   const result = await makePayment();
//   console.log(result);
// })();

export interface InterfacePaymentRequestDtos {
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

  anti_duplication?: {
    id: string;
    user_id: string;
    processed: boolean;
  };
}

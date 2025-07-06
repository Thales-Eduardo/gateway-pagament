export interface InterfacePaymentRequestDtos {
  produto: {
    reserve_id: string;
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

import { PaymentRepository } from "./PaymentRepository";

const paymentRepo = new PaymentRepository();

describe("PaymentRepository", () => {
  afterAll(async () => {
    await paymentRepo.deletePaymentRequest();
    await paymentRepo.deleteAntDuplication();
  });

  beforeEach(async () => {});

  describe("createPaymentRequest", () => {
    it("deve criar um novo registro e retornar seu ID", async () => {
      const dto = {
        produto: {
          product_id: "prod_123",
          user_id: "user_456",
          price: 100,
          quantity: 1,
        },
        card: {
          card_number: "4111111111111111",
          card_exp_month: "12",
          card_exp_year: "2025",
          card_security_code: "123",
        },
        data: new Date(),
      };

      const result = await paymentRepo.createPaymentRequest(dto);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("id");
      expect(typeof result?.id).toBe("string");

      const created = await paymentRepo.findPaymentRequest(result?.id);

      expect(created).not.toBeNull();
      expect(created?.user_id).toBe("user_456");
    });

    it("deve retornar null quando já existe registro recente", async () => {
      const dto = {
        produto: {
          product_id: "prod_123",
          user_id: "user_456",
          price: 100,
          quantity: 1,
        },
        card: {
          card_number: "4111111111111111",
          card_exp_month: "12",
          card_exp_year: "2025",
          card_security_code: "123",
        },
        data: new Date(),
      };

      const firstResult = await paymentRepo.createPaymentRequest(dto);
      expect(firstResult).not.toBeNull();

      const secondResult = await paymentRepo.createPaymentRequest(dto);
      expect(secondResult).toBeFalsy();
    });
  });

  describe("checkAndUpdateOptimistic", () => {
    it("deve retornar true quando o registro existe e process é false", async () => {
      await paymentRepo.createRecordAntiDuplication("tx_123", "user_1", false);

      const result = await paymentRepo.checkAndUpdateOptimistic("tx_123");

      expect(result).toEqual({
        value: true,
        id_transaction: "tx_123",
      });

      // Verifica se realmente atualizou no banco
      const updated = await paymentRepo.findAntiDuplication("tx_123");

      expect(updated?.process).toBe(true);
    });

    it("deve retornar false quando o registro existe e process já é true", async () => {
      await paymentRepo.createRecordAntiDuplication("tx_456", "user_2", true);

      const result = await paymentRepo.checkAndUpdateOptimistic("tx_456");

      expect(result).toEqual({
        value: false,
        id_transaction: "tx_456",
      });

      const notUpdated = await paymentRepo.findAntiDuplication("tx_456");
      expect(notUpdated?.process).toBe(true);
    });

    it("deve retornar false quando o registro não existe", async () => {
      const result = await paymentRepo.checkAndUpdateOptimistic(
        "tx_inexistente"
      );

      expect(result).toEqual({
        value: false,
        id_transaction: "tx_inexistente",
      });
    });
  });
});

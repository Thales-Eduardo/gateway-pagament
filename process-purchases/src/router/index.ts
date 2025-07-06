import { Router } from "express";
import { PaymentRepository } from "../repository/PaymentRepository";
import { ReservedProductRepository } from "../repository/ReservedProductRepository";
import { ReceivePaymentRequest } from "../services/receivePaymentRequest";

const receivePaymentRequest = new ReceivePaymentRequest(
  new PaymentRepository(),
  new ReservedProductRepository()
);

export const router = Router();

router.post("/payment", async (req, res) => {
  const { produto, card } = req.body;

  await receivePaymentRequest.execute({
    produto,
    card,
    data: new Date(),
  });

  res.status(202).json({
    message: "Process Purchases Service is running",
  });
});

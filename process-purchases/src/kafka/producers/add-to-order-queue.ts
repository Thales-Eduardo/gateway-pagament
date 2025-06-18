import { producer } from "./index";

interface messageDtos {
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

export async function producerOrderQueue(message: messageDtos) {
  try {
    const metadata = await producer.send({
      topic: "order_queue",
      messages: [
        {
          key: message.produto.user_id,
          value: JSON.stringify(message),
          headers: {
            origin: "my-producer-order_queue",
            attempt: "0",
          },
        },
      ],
    });

    return metadata;
  } catch (error: any) {
    await sendToDLQ({
      originalTopic: "order_queue",
      originalMessage: message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

async function sendToDLQ(dlqPayload: any) {
  try {
    await producer.send({
      topic: "order_queue_dlq",
      messages: [
        {
          value: JSON.stringify(dlqPayload),
        },
      ],
    });
    console.log("Mensagem enviada para DLQ");

    await producer.disconnect();
  } catch (dlqError: any) {
    console.error("FALHA CRÍTICA: Erro ao enviar para DLQ", dlqError);
  }
}

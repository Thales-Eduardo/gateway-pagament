import { AppErrors } from "../error/errors";

interface ValidatorDTOs {
  database: {
    quantity: number;
    price: number;
    id: string;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
  };

  produto: {
    product_id: string;
    user_id: string;
    price: number;
    quantity: number;
    total_price: number;
  };
}

export class Validator {
  constructor() {}

  private compareDecimals(a: string | number, b: unknown): boolean {
    const numA = Number(parseFloat(String(a)).toFixed(4));
    const numB = Number(parseFloat(String(b)).toFixed(4));
    return numA === numB;
  }

  private validateQuantity(data: ValidatorDTOs): void {
    if (data.produto.quantity <= 0) {
      throw new AppErrors("Quantidade deve ser positiva");
    }
    if (data.produto.quantity > data.database.quantity) {
      throw new AppErrors(
        `Quantidade indisponível. Solicitação: ${data.produto.quantity}, Disponível: ${data.database.quantity}`
      );
    }
    if (data.produto.quantity > 100) {
      throw new AppErrors("Quantidade máxima permitida é 100 unidades.");
    }
  }

  private validatePrice(data: ValidatorDTOs): void {
    if (data.produto.total_price <= 0) {
      throw new AppErrors("Total deve ser positivo");
    }
    if (data.produto.price <= 0) {
      throw new AppErrors("Preço deve ser positivo");
    }

    if (!this.compareDecimals(data.produto.price, data.database.price)) {
      throw new AppErrors(
        `Preço inconsistente. Esperado: ${data.database.price}, Recebido: ${data.produto.price}`
      );
    }
  }

  public validate(data: ValidatorDTOs): void {
    this.validateQuantity(data);
    this.validatePrice(data);

    //verificar se o total_price é consistente com o preço e a quantidade, req e banco
    if (
      !this.compareDecimals(
        data.produto.total_price,
        data.produto.price * data.produto.quantity
      )
    ) {
      throw new AppErrors(
        `Total inconsistente. Esperado: ${
          data.produto.price * data.produto.quantity
        }, Recebido: ${data.produto.total_price}`
      );
    }
    const expectedTotal = Number(data.database.price) * data.produto.quantity;
    if (!this.compareDecimals(data.produto.total_price, expectedTotal)) {
      throw new AppErrors(
        `Preço total inconsistente. Esperado: ${expectedTotal.toFixed(
          2
        )}, Recebido: ${data.produto.total_price.toFixed(2)}`
      );
    }
  }
}

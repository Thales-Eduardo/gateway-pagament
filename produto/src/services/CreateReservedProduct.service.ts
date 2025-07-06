import { AppErrors } from "../error/errors";
import { ProductRepository } from "../infra/database/mysql/repository/ProductRepository";
import { ReservedProductRepository } from "../infra/database/mysql/repository/ReservedProduct";
import { Validator } from "../validator/price.validator";

export enum StatusPayment {
  PENDING,
  PROCESSING,
  AUTHORIZED,
}

export class CreateReservedProductService extends Validator {
  private database: any = {};

  constructor(
    private reservedProductRepository: ReservedProductRepository,
    private productRepository: ProductRepository
  ) {
    super();
    this.reservedProductRepository = reservedProductRepository;
  }

  async execute(data: any) {
    const findProduct = await this.productRepository.findById(data.product_id);
    if (!findProduct) throw new AppErrors("Produto não encontrado.");
    this.database = findProduct;

    data.price = findProduct.price;
    this.validate({
      database: this.database,
      produto: data,
    });

    await this.reservedProductRepository
      .create({
        products_id: data.product_id,
        user_id: data.user_id,
        quantity: data.quantity,
        price_total: data.total_price,
        status: StatusPayment.PENDING,
      })
      .catch(console.log);

    await this.productRepository.updateQuantity(findProduct.id, data.quantity);
  }
}

import { Request, Response, Router } from "express";
import { RepositoryElastic } from "../infra/database/elasticsearch/db/repository/repositoryElastic";
import { ProductRepository } from "../infra/database/mysql/repository/ProductRepository";
import { ReservedProductRepository } from "../infra/database/mysql/repository/ReservedProduct";
import { CreateProductService } from "../services/CreateProduct.service";
import { CreateReservedProductService } from "../services/CreateReservedProduct.service";
import { FindAllProductService } from "../services/FindAllProduct.service";
import { GetProductsByIdService } from "../services/GetProductsById.service";
import { GetProductsByNameServicee } from "../services/GetProductsByName.service";

const productRepository = new ProductRepository();
const productRepositoryElastic = new RepositoryElastic();
const reservedProductRepository = new ReservedProductRepository();

export const router = Router();

router.get("/findByName/:name", async (req: Request, res: Response) => {
  const { name } = req.params;
  const getProductsByNameServicee = new GetProductsByNameServicee(
    productRepositoryElastic
  );

  try {
    const product = await getProductsByNameServicee.execute(name);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

router.get("/findById/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const getProductsByIdService = new GetProductsByIdService(
    productRepositoryElastic
  );

  try {
    const product = await getProductsByIdService.execute(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

router.get("/findAll", async (req: Request, res: Response) => {
  const findAllProductService = new FindAllProductService(
    productRepositoryElastic
  );

  try {
    const products = await findAllProductService.execute();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching all products" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const createProductService = new CreateProductService(productRepository);

  await createProductService.execute();
  res.status(201).json({ message: "Products created successfully" });
});

router.post("/reserve", async (req: Request, res: Response) => {
  const data = req.body;

  const createProductService = new CreateReservedProductService(
    reservedProductRepository,
    productRepository
  );

  await createProductService.execute(data);
  res.status(201).json({ message: "Reserved" });
});

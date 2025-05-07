import { prismaClient } from "../connection";
import { ProductRepository } from "./ProductRepository";

describe("ProductRepository - Integration Tests", () => {
  let productRepository: ProductRepository;

  beforeAll(async () => {
    productRepository = new ProductRepository();
    await prismaClient.product.deleteMany();
  });

  afterEach(async () => {
    await prismaClient.product.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe("create", () => {
    it("should create a new product in the database", async () => {
      const productData = {
        name: "Test Product",
        price: 99.99,
        quantity: 10,
      };

      const createdProduct = await productRepository.create(productData);

      expect(createdProduct).toHaveProperty("id");
      expect(createdProduct.name).toBe(productData.name);
      expect(createdProduct.price).toBe(productData.price);
      expect(createdProduct.quantity).toBe(productData.quantity);

      const dbProduct = await prismaClient.product.findUnique({
        where: { id: createdProduct.id },
      });
      expect(dbProduct).toEqual(createdProduct);
    });
  });

  describe("findAll", () => {
    it("should return all products from the database", async () => {
      const dados = [
        { name: "Product 1", price: 10, quantity: 5 },
        { name: "Product 2", price: 20, quantity: 3 },
      ];

      await prismaClient.product.createMany({
        data: dados,
      });

      const products = await productRepository.findAll();

      expect(products).toHaveLength(2);
      expect(products[0].name).toBe(dados[0].name);
      expect(products[1].name).toBe(dados[1].name);
    });
  });

  describe("findById", () => {
    it("should return a product by id", async () => {
      const testProduct = await prismaClient.product.create({
        data: { name: "Find Test", price: 15, quantity: 8 },
      });

      console.log(testProduct.id);
      const foundProduct = await productRepository.findById(testProduct.id);

      expect(foundProduct).toEqual(testProduct);
    });

    it("should return null for non-existent id", async () => {
      const foundProduct = await productRepository.findById("9999");
      expect(foundProduct).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an existing product", async () => {
      const testProduct = await prismaClient.product.create({
        data: { name: "Update Test", price: 30, quantity: 4 },
      });

      const updatedData = { name: "Updated Name", price: 35, quantity: 6 };
      const updatedProduct = await productRepository.update(
        String(testProduct.id),
        updatedData
      );

      expect(updatedProduct).toMatchObject(updatedData);

      const dbProduct = await prismaClient.product.findUnique({
        where: { id: testProduct.id },
      });
      expect(dbProduct).toMatchObject(updatedData);
    });
  });

  describe("delete", () => {
    it("should delete an existing product", async () => {
      const testProduct = await prismaClient.product.create({
        data: { name: "Delete Test", price: 25, quantity: 2 },
      });

      await productRepository.delete(String(testProduct.id));

      const dbProduct = await prismaClient.product.findUnique({
        where: { id: testProduct.id },
      });
      expect(dbProduct).toBeNull();
    });
  });
});

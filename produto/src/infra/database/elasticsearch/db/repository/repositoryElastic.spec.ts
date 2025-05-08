import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import { esMapping } from "../migrations/up";
import { RepositoryElastic } from "./repositoryElastic";
dotenv.config();

describe("RepositoryElastic - Integration Tests", () => {
  let repository: RepositoryElastic;
  let esClient: Client;
  let indexName: string =
    process.env.ELASTICSEARCH_INDEX_NAME || "default_index_name";

  beforeAll(async () => {
    esClient = new Client({ node: process.env.ELASTICSEARCH_URL });
    repository = new RepositoryElastic();

    try {
      await esClient.indices.delete({
        index: indexName,
        ignore_unavailable: true, // Ignora se o índice não existir
      });
    } catch (error) {
      console.error("Error cleaning up test index:", error);
    }
  });

  beforeEach(async () => {
    try {
      await esClient.indices.create({
        index: indexName,
        mappings: esMapping,
      });
    } catch (error: any) {
      if (
        error.meta?.body?.error?.type !== "resource_already_exists_exception"
      ) {
        throw error;
      }
    }
  });

  afterEach(async () => {
    try {
      await esClient.deleteByQuery({
        index: indexName,
        query: {
          match_all: {},
        },
        refresh: true,
        conflicts: "proceed", // Ignora conflitos de versão
      });
    } catch (error) {
      console.error("Error cleaning test data:", error);
    }
  });

  afterAll(async () => {
    try {
      await esClient.indices.delete({
        index: indexName,
        ignore_unavailable: true,
      });
    } catch (error) {
      console.error("Error deleting test index:", error);
    }
    await esClient.close();
  });

  describe("insertDocument", () => {
    it("should insert a document into Elasticsearch", async () => {
      const result = await repository.insertDocument("Test Product", 99.99, 10);

      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("result", "created");

      const doc = await esClient.get({
        index: indexName,
        id: result._id,
      });

      expect(doc._source).toEqual({
        name: "Test Product",
        price: 99.99,
        quantity: 10,
      });
    });
  });

  describe("updateDocument", () => {
    it("should update an existing document", async () => {
      const insertResult = await repository.insertDocument("Old Name", 50, 5);
      const docId = insertResult._id;

      await repository.updateDocument(docId, "New Name", 75, 8);

      const updatedDoc = await esClient.get({
        index: indexName,
        id: docId,
      });

      expect(updatedDoc._source).toEqual({
        name: "New Name",
        price: 75,
        quantity: 8,
      });
    });
  });

  describe("deleteDocument", () => {
    it("should delete an existing document", async () => {
      const insertResult = await repository.insertDocument("To Delete", 30, 3);
      const docId = insertResult._id;

      await repository.deleteDocument(docId);

      await expect(
        esClient.get({
          index: indexName,
          id: docId,
        })
      ).rejects.toThrow();
    });

    it("should not throw error when deleting non-existent document", async () => {
      await expect(
        repository.deleteDocument("non-existent-id")
      ).resolves.not.toThrow();
    });
  });

  describe("searchName", () => {
    it("should search documents by name", async () => {
      await repository.insertDocument("Apple iPhone", 999, 5);
      await repository.insertDocument("Samsung Galaxy", 899, 7);
      await repository.insertDocument("Apple Watch", 399, 3);

      await esClient.indices.refresh({ index: indexName });

      const result = await repository.searchName("Apple");

      expect(result.hits.hits).toHaveLength(2);
      expect((result.hits.hits[0]._source as { name: string }).name).toContain(
        "Apple"
      );
      expect((result.hits.hits[1]._source as { name: string }).name).toContain(
        "Apple"
      );
    });
  });

  describe("findById", () => {
    it("should find document by id", async () => {
      const insertResult = await repository.insertDocument("Find Test", 45, 2);
      const docId = insertResult._id;

      await esClient.indices.refresh({ index: indexName });

      const result = await repository.findById(docId);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("_id", docId);
      expect(result).toHaveProperty("name", "Find Test");
      expect(result).toHaveProperty("price", 45);
      expect(result).toHaveProperty("quantity", 2);
    });
  });
});

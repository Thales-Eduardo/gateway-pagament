import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ node: process.env.ELASTICSEARCH_URL });
const indexName = process.env.ELASTICSEARCH_INDEX_NAME || "products";

(async () => {
  const exists = await client.indices.exists({ index: indexName });
  if (exists) {
    await client.indices.delete({
      index: indexName,
    });
  }
})();

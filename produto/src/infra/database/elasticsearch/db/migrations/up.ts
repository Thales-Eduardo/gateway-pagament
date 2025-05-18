import { Client } from "@elastic/elasticsearch";
import { MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ node: process.env.ELASTICSEARCH_URL });

export const esMapping: MappingTypeMapping = {
  dynamic: true, //campos que não estão mapeados previamente, serão criados automaticamente
  //   _source: { enabled: true },
  //   dynamic_date_formats: [
  //     "yyyy-MM-dd",
  //     "yyyy-MM-dd'T'HH:mm:ss.SSSZ",
  //     "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
  //     "yyyy-MM-dd'T'HH:mm:ss.SSS",
  //     "yyyy-MM-dd'T'HH:mm:ssZZ",
  //     "yyyy-MM-dd'T'HH:mm:ssZ",
  //   ],
  properties: {
    id: {
      type: "keyword",
      index: true, //se o campo será indexado para buscas.
    },
    name: {
      type: "text",
      index: true,
      store: true, // Pode buscar só o nome sem carregar o _source
      fields: {
        keyword: {
          type: "keyword",
          ignore_above: 256,
        },
      },
      analyzer: "portuguese",
      search_analyzer: "portuguese",
    },
    price: {
      type: "float",
    },
    quantity: {
      type: "integer",
    },
  },
};

(async () => {
  await client.indices.create({
    index: process.env.ELASTICSEARCH_INDEX_NAME || "product",
    mappings: esMapping,
  });
})();

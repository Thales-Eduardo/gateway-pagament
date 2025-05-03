import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://localhost:9200",
});
//   node: "http://elasticsearch:9200",
//   Connection: require("@elastic/elasticsearch/lib/Connection"),
//   ConnectionPool: require("@elastic/elasticsearch/lib/ConnectionPool"),
//   Transport: require("@elastic/elasticsearch/lib/Transport"),
//   auth: {
//     apiKey: {
//       id: "foo",
//       api_key: "bar",
//     },
//   },
const indexName = "produto";

export async function deleteIndex() {
  try {
    const exists = await client.indices.exists({ index: indexName });
    if (exists) {
      const result = await client.indices.delete({
        index: indexName,
      });
      console.log(result);
      console.log("Index deleted");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

//criar um índice
export async function createIndex() {
  try {
    await client.indices.create({
      index: indexName,
    });
    console.log("Index created");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function insertDocument() {
  try {
    const result = await client.index({
      index: indexName,
      refresh: true,
      body: {
        name: "Luiz",
        age: 25,
      },
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function updateDocument(id: any) {
  try {
    const result = await client.update({
      index: indexName,
      id: id,
      refresh: true,
      doc: {
        age: 26,
      },
    });
    console.log(result);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function deleteDocument(id: any) {
  try {
    const exists = await client.indices.exists({ index: indexName });
    if (exists) {
      const result = await client.indices.delete({ index: indexName });
      console.log(result);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function search() {
  try {
    const result = await client.search({
      index: indexName,

      query: {
        match: {
          name: "Luiz",
        },
      },
    });
    console.dir(result, { depth: null });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function bootstrap() {
  await deleteIndex();
  await createIndex();
  //@ts-expect-error - ignorar erro de tipo
  const { _id } = await insertDocument();
  await updateDocument(_id);
  await search();
  await deleteDocument(_id);
}

bootstrap();
// ❯ yarn ts-node-dev src/elasticsearch/example/elasticsearch-roleplay.ts

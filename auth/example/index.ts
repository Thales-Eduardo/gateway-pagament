import dotenv from "dotenv";
import express from "express";
import { isAdmin } from "./check-is-admin";
const environment = "../.env";
dotenv.config({ path: environment });

const app = express();

app.get("/", isAdmin, (req, res) => {
  console.log("deu certo");

  res.send("deu certo");
});

app.listen(3334, () => {
  console.log("http://localhost:3333");
});

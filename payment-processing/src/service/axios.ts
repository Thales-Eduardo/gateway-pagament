import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

axios.defaults.baseURL = process.env.PAYMENTS_URL;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + process.env.PAYMENTS_TOKEN;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["x-api-version"] =
  process.env.PAYMENTS_X_API_VERSION ?? "4.0";

export const api = axios;

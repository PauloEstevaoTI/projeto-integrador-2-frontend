import axios from "axios";

export const api = axios.create({
  baseURL: "https://sistema-gestao-educacional.fly.dev",
});

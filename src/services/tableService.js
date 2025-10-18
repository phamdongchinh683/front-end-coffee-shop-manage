import { api } from "../config/axiosConfig";
export const getTables = (page, size) =>
  api.get(`/v1/tables?page=${page}&size=${size}`);
export const register = (credentials) =>
  api.post("/v1/auth/register", credentials);

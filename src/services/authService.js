import { api } from "../config/axiosConfig";
export const LoginWithUsername = (credentials) =>
  api.post("/v1/auth/login", credentials);
export const register = (credentials) =>
  api.post("/v1/auth/register", credentials);

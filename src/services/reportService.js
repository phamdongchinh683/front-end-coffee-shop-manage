import { api } from "../config/axiosConfig";

export const getMenus = (page, size) =>
  api.get(`/v1/reports?page=${page}&size=${size}`);

export const getTotalRevenue = () => {
  return api.get("/v1/reports/total-revenue");
};

export const getTotalCustomer = () => {
  return api.get("/v1/reports/total-guest");
};

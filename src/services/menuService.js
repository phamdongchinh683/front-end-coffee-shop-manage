import { api } from "../config/axiosConfig";
export const getMenus = (page, size) =>
  api.get(`/v1/menus?page=${page}&size=${size}`);

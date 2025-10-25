import { api } from "../config/axiosConfig";

export const createReservation = (reservationData) =>
  api.post("/v1/reservations/send-message", reservationData);

export const getReservations = (page = 1, size = 10) =>
  api.get(`/v1/reservations/with-details?page=${page}&size=${size}`);

export const updateReservation = (id) =>
  api.put(`/v1/reservations/verify-reservation/${id}`);

export const getReservationsByUser = (userId, page = 1, size = 10) =>
  api.get(`/v1/reservations/user/${userId}?page=${page}&size=${size}`);

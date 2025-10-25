import { api } from "../config/axiosConfig";

// Create a new order
export const createOrder = (orderData) => api.post("/v1/orders", orderData);

// Create order items for an existing order
export const createOrderItems = (orderItems) =>
  api.post("/v1/order-items/batch", orderItems);

// Get orders by reservation
export const getOrdersByReservation = (reservationId) =>
  api.get(`/v1/orders/reservation/${reservationId}`);

// Get order details
export const getOrderDetails = (orderId) => api.get(`/v1/orders/${orderId}`);

// Update order status
export const updateOrderStatus = (orderId, status) =>
  api.put(`/v1/orders/${orderId}/status`, { status });

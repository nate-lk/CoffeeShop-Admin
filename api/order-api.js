import apiAuth from "./baseAuth";

const BASE = import.meta.env.VITE_API_ORDER;
// Example: http://localhost:4004/api/order/admin

export const orderApi = {

  getAllOrder(page, limit) {
    return apiAuth.get(`${BASE}/get`, {
      params: { page, limit }
    });
  },

  getOneOrder(orderId) {
    return apiAuth.get(`${BASE}/get-one/${orderId}`)
  },

  confirmPayment(orderId, items) {
    return apiAuth.put(`${BASE}/confirm-payment/${orderId}`, { items });
  },

  cancelOrder(orderId) {
    return apiAuth.put(`${BASE}/cancel/${orderId}`);
  },
};
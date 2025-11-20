import axios from 'axios';
import apiAuth from "./baseAuth"

const apiPublic = axios.create({
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

const BASE = import.meta.env.VITE_API_PRODUCT;
// http://locahost:4000/api/product

export const productApi = {
  getProduct() {
    return apiPublic.get(`${BASE}/get`);
  },

  getOneProduct(productId) {
    return apiPublic.get(`${BASE}/fetch/${productId}`);
  },

  stockVerify(productId, quantity) {
    return apiPublic.post(`${BASE}/stock/${productId}`, { quantity });
  },

  addProduct(formData) {
    return apiAuth.post(`${BASE}/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  updateProduct(productId, formData) {
    return apiAuth.post(`${BASE}/edit/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  // deleteProduct(productId) {
  //   return apiAuth.delete(`${BASE}/stock/${productId}`);
  // }
};
import axios from 'axios';
import apiAuth from "./baseAuth"

const apiPublic = axios.create({
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

const BASE = import.meta.env.VITE_API_CATEGORY;
// http://locahost:4000/api/category

export const categoryApi = {
  getCategory() {
    return apiPublic.get(`${BASE}/get`);
  },

  getOneCategory(categoryId) {
    return apiPublic.get(`${BASE}/fetch/${categoryId}`);
  },

  addCategory(formData) {
    return apiAuth.post(`${BASE}/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  updateCategory(categoryId, formData) {
    return apiAuth.post(`${BASE}/edit/${categoryId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  // deleteCategory(categoryId) {
  //   return apiAuth.delete(`${BASE}/delete/${categoryId}`);
  // }
};
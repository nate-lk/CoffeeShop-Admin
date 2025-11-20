import apiAuth from "./baseAuth";
import axios from 'axios';

const BASE = import.meta.env.VITE_API_ADMIN;
/*
VITE_API_ADMIN=http://localhost:4000/api/admin
*/
const apiPublic = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const adminApi = {
  // public APIs, no authentication
  login(email, password) {
    return apiPublic.post(`${BASE}/login`, { email, password });
  },

  register(email, password) {
    return apiPublic.post(`${BASE}/register`, { email, password });
  },

  // Authenticated API
  logout() {
    const url = `${BASE}/logout`
    console.log(url)
    return apiAuth.post(url, {});
  },
};

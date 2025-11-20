import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  withCredentials: true
});

const refreshApi = axios.create({
  withCredentials: true
});


// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh logic
let isRefreshing = false;
let queue = [];

function resolveQueue(error, token = null) {
  queue.forEach(p => error ? p.reject(error) : p.resolve(token));
  queue = [];
}

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) return Promise.reject(err);

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;
    try {
      const res = await refreshApi.post("http://localhost:4000/api/admin/refresh");
      const newToken = res.data.accessToken;

      localStorage.setItem("token", newToken);
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
      resolveQueue(null, newToken);
      return api(original);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      localStorage.removeItem("token");
      const confirm = await Swal.fire({
        text: "Phiên đăng nhập đã hết hạn. Xin đăng nhập lại.",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đăng nhập lại",
        width: "300px",
      });
      if (!confirm.isConfirmed) return;
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

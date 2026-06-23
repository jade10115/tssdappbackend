import axios from "axios";

// ✅ Hardcode the live Render URL. Ignore Vercel environment variables completely!
axios.defaults.baseURL = "https://tssdapp-1.onrender.com";

// ✅ Set to false because you are using Bearer tokens
axios.defaults.withCredentials = false;

// ✅ Automatically attach token to EVERY request globally
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auto logout on 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear(); // Wipe everything securely
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
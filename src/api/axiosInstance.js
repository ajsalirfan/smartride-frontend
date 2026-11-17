import axios from "axios";

// Vercel-ൽ നിന്നുള്ള ലിങ്ക് എടുക്കുക, ഇല്ലെങ്കിൽ ലോക്കൽഹോസ്റ്റ് എടുക്കുക
const API_BASE = process.env.REACT_APP_API_BASE_URL 
  ? process.env.REACT_APP_API_BASE_URL.replace(/\/$/, "") + "/api/Users/" 
  : "http://127.0.0.1:8000/api/Users/";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// 🚀 URLs that SHOULD NOT attach Authorization header
const noAuthEndpoints = [
  "/api/Users/login/",
  "/api/Users/register/",
  "/api/Admin/login/",
  "/api/StaffWork/auth/login/",
];

// 🔐 Attach JWT token only when allowed
axiosInstance.interceptors.request.use(
  (config) => {
    const cleanURL = config.url; // ✅ FIXED

    if (noAuthEndpoints.includes(cleanURL)) {
      // ❗Do NOT attach any token for login endpoints
      delete config.headers.Authorization;
      return config;
    }

    // Normal requests → attach token
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
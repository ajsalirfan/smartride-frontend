// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/";

// const axiosInstance = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000,
// });

// // 🚀 URLs that SHOULD NOT attach Authorization header
// const noAuthEndpoints = [
//   "/api/Users/login/",
//   "/api/Users/register/",
//   "/api/Admin/login/",
//   "/api/StaffWork/auth/login/",
// ];

// // 🔐 Attach JWT token only when allowed
// axiosInstance.interceptors.request.use(
//   (config) => {

//     const cleanURL = config.url;  // ✅ FIXED

//     if (noAuthEndpoints.includes(cleanURL)) {
//       // ❗Do NOT attach any token for login endpoints
//       delete config.headers.Authorization;
//       return config;
//     }

//     // Normal requests → attach token
//     const token = localStorage.getItem("access");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;



// import axios from "axios";

// //Correct backend base URL
// const API_BASE = "http://127.0.0.1:8000/api/Users/";

// const axiosInstance = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000,
// });

// // Attach JWT token automatically
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;


import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/Users/";  // ✅ FIXED BACK TO WORKING VERSION

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

const noAuthEndpoints = [
  "/api/Users/login/",
  "/api/Users/register/",
  "/api/Admin/login/",
  "/api/StaffWork/auth/login/",
];

axiosInstance.interceptors.request.use(
  (config) => {
    const cleanURL = config.url;

    if (noAuthEndpoints.includes(cleanURL)) {
      delete config.headers.Authorization;
      return config;
    }

    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

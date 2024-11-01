// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_BASE_URL,
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('idToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         console.error('Request error:', error);
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         // Handle response error
//         console.error('Response error:', error);
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;


import axios from "axios";
import { getToken } from "../utils/TokenManager";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();  
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   console.error("Unauthorized error:", error.response.data);
    //   window.location.href = process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI;
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
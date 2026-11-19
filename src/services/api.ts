import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const responseMessage = error.response?.data?.ReturnMessage || error.response?.data?.message;
      return Promise.reject(new Error(responseMessage || error.message || "The server could not be reached."));
    }
    return Promise.reject(error);
  },
);

export default api;
import axios from "axios";

export const connectDB = () => {
  const api = axios.create({
    baseURL: "/escalonada-promo/api/api/v1"
  });

  return api;
};

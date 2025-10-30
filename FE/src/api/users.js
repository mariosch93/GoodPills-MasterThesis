import api from "./axiosInstance";

export const getUsers = () => api.get("/Customer");
export const createUser = (data) => api.post("/Customer", data);
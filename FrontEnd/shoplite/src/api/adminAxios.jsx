import axios from "axios";

const adminAxios = axios.create({
    baseURL: "http://localhost:8080",
});

adminAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("adminToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default adminAxios;
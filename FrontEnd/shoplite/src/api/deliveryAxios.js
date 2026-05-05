import axios from "axios";

const deliveryAxios = axios.create({
    baseURL: "http://localhost:8080/api",
});

deliveryAxios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("deliveryToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default deliveryAxios;
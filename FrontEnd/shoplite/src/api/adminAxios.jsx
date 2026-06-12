import axios from "axios";

const adminAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// ================= REQUEST =================
adminAxios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("adminToken");

        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ================= RESPONSE =================
adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn("Admin session expired");
                sessionStorage.removeItem("adminToken");
                sessionStorage.removeItem("adminRole");
            }
        }

        return Promise.reject(error);
    }
);

export default adminAxios;
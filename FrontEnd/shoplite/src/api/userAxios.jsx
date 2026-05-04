import axios from "axios";

const userAxios = axios.create({
    baseURL: "http://localhost:8080/api",
});

userAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    const publicRoutes = ["/products", "/categories", "/auth"];

    const isPublic = publicRoutes.some((route) =>
        config.url.startsWith(route)
    );

    if (!isPublic && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

userAxios.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);
export default userAxios;
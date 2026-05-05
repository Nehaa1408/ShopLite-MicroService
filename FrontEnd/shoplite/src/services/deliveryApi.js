import axios from "axios";

const deliveryAxios = axios.create({
    baseURL: "http://localhost:8080/api",
});

// ================= REQUEST =================
deliveryAxios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("deliveryToken");

        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ================= RESPONSE =================
deliveryAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Delivery session expired");
            sessionStorage.removeItem("deliveryToken");
            sessionStorage.removeItem("deliveryRole");
        }

        return Promise.reject(error);
    }
);

// ================= API FUNCTIONS =================

//  GET assigned delivery orders
export const getDeliveryOrders = async () => {
    const res = await deliveryAxios.get("/orders/delivery")
    return res.data;
};

//  UPDATE order status to delivered
export const updateOrderStatus = async (orderId) => {
    const res = await deliveryAxios.put(`/orders/delivery/${orderId}/complete`);
    return res.data;
};

//  GET completed delivery orders
export const getCompletedOrders = async () => {
    const res = await deliveryAxios.get("/orders/delivery/completed");
    return res.data;
};

export default deliveryAxios;
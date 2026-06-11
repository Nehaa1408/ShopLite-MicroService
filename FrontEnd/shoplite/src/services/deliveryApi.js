import axios from "axios";

const deliveryAxios = axios.create({
    baseURL: "http://localhost:8080/api",
});

// ================= REQUEST INTERCEPTOR =================
deliveryAxios.interceptors.request.use(
    (config) => {

        const deliveryToken =
            sessionStorage.getItem("deliveryToken");

        const adminToken =
            sessionStorage.getItem("adminToken");

        const userToken =
            localStorage.getItem("token");

        let token =
            deliveryToken || userToken;

        // ADMIN DELIVERY MANAGEMENT APIs
        if (
            config.url?.includes("/delivery/all") ||
            config.url?.includes("/delivery/approve") ||
            config.url?.includes("/delivery/reject") ||
            config.url?.includes("/delivery/pending") ||
            (
                config.url?.startsWith("/delivery/") &&
                !config.url?.includes("/profile")
            )
        ) {
            token =
                adminToken ||
                deliveryToken ||
                userToken;
        }

        if (
            token &&
            token !== "null" &&
            token !== "undefined"
        ) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
deliveryAxios.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {

            sessionStorage.removeItem("deliveryToken");
            sessionStorage.removeItem("deliveryRole");

            sessionStorage.removeItem("adminToken");
            sessionStorage.removeItem("adminRole");
        }

        return Promise.reject(error);
    }
);

// ================= DELIVERY PARTNER APIs =================

export const getAllDeliveryPartners = async () => {
    const res =
        await deliveryAxios.get("/delivery/all");
    return res.data;
};

export const getDeliveryPartnerById = async (id) => {
    const res =
        await deliveryAxios.get(`/delivery/${id}`);
    return res.data;
};

export const approveDeliveryPartner = async (id) => {
    const res =
        await deliveryAxios.put(`/delivery/approve/${id}`);
    return res.data;
};

export const rejectDeliveryPartner = async (id) => {
    const res =
        await deliveryAxios.put(`/delivery/reject/${id}`);
    return res.data;
};

export const getPendingDeliveryPartners = async () => {
    const res =
        await deliveryAxios.get("/delivery/pending");
    return res.data;
};

// ================= DELIVERY ORDER APIs =================

export const getDeliveryOrders = async () => {
    const res =
        await deliveryAxios.get("/orders/delivery");
    return res.data;
};

export const sendDeliveryOtp = async (orderId) => {
    const res =
        await deliveryAxios.post(
            `/orders/delivery/${orderId}/send-otp`
        );
    return res.data;
};

export const verifyDeliveryOtp = async (
    orderId,
    otp
) => {

    const res =
        await deliveryAxios.post(
            `/orders/delivery/${orderId}/verify-otp`,
            { otp }
        );

    return res.data;
};

export const markDeliveryFailed = async (
    orderId,
    reason
) => {

    const res =
        await deliveryAxios.put(
            `/orders/delivery/${orderId}/failed?reason=${encodeURIComponent(reason)}`
        );

    return res.data;
};

export const getCompletedOrders = async () => {
    const res =
        await deliveryAxios.get(
            "/orders/delivery/completed"
        );

    return res.data;
};

// ================= CONFIRM COD PAYMENT =================

export const confirmCodPayment = async (
    orderId
) => {

    const res =
        await deliveryAxios.put(
            `/orders/delivery/${orderId}/confirm-cod`
        );

    return res.data;
};

// ================= RETURN PICKUP APIs =================

// GET ASSIGNED RETURN PICKUPS
export const getAssignedReturnPickups = async () => {

    const res =
        await deliveryAxios.get(
            "/returns/assigned"
        );

    return res.data;
};

// SEND RETURN PICKUP OTP
export const sendReturnPickupOtp = async (
    returnId
) => {

    const res =
        await deliveryAxios.post(
            `/returns/${returnId}/send-pickup-otp`
        );

    return res.data;
};

// VERIFY RETURN PICKUP OTP
export const verifyReturnPickupOtp = async (
    returnId,
    otp
) => {

    const res =
        await deliveryAxios.post(
            `/returns/${returnId}/verify-pickup-otp`,
            { otp }
        );

    return res.data;
};

// COMPLETED RETURN PICKUPS
export const getCompletedReturnPickups = async () => {

    const res =
        await deliveryAxios.get(
            "/returns/completed-pickups"
        );

    return res.data;
};

export default deliveryAxios;
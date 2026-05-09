import axios from "axios";

const deliveryAxios = axios.create({
    baseURL: "http://localhost:8080/api",
});

// ================= REQUEST INTERCEPTOR =================
deliveryAxios.interceptors.request.use(
    (config) => {

        // DELIVERY TOKEN
        const deliveryToken =
            sessionStorage.getItem("deliveryToken");

        // ADMIN TOKEN
        const adminToken =
            sessionStorage.getItem("adminToken");

        // DELIVERY APIs should use delivery token
        let token = deliveryToken;

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
            token = adminToken || deliveryToken;
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

        // AUTO LOGOUT ON TOKEN EXPIRE
        if (error.response?.status === 401) {

            sessionStorage.removeItem("deliveryToken");
            sessionStorage.removeItem("deliveryRole");

            sessionStorage.removeItem("adminToken");
            sessionStorage.removeItem("adminRole");
        }

        return Promise.reject(error);
    }
);

// ================= DELIVERY APIs =================

// GET ALL DELIVERY PARTNERS
export const getAllDeliveryPartners = async () => {

    const res =
        await deliveryAxios.get("/delivery/all");

    return res.data;
};

// GET SINGLE DELIVERY PARTNER
export const getDeliveryPartnerById = async (id) => {

    const res =
        await deliveryAxios.get(`/delivery/${id}`);

    return res.data;
};

// APPROVE DELIVERY PARTNER
export const approveDeliveryPartner = async (id) => {

    const res =
        await deliveryAxios.put(`/delivery/approve/${id}`);

    return res.data;
};

// REJECT DELIVERY PARTNER
export const rejectDeliveryPartner = async (id) => {

    const res =
        await deliveryAxios.put(`/delivery/reject/${id}`);

    return res.data;
};

// GET PENDING DELIVERY PARTNERS
export const getPendingDeliveryPartners = async () => {

    const res =
        await deliveryAxios.get("/delivery/pending");

    return res.data;
};
// ================= DELIVERY ORDER APIs =================

// GET ASSIGNED DELIVERY ORDERS
export const getDeliveryOrders = async () => {

    const res =
        await deliveryAxios.get("/orders/delivery");

    return res.data;
};

// SEND DELIVERY OTP
export const sendDeliveryOtp = async (orderId) => {

    const res =
        await deliveryAxios.post(
            `/orders/delivery/${orderId}/send-otp`
        );

    return res.data;
};

// VERIFY DELIVERY OTP
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

// MARK DELIVERY FAILED
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

// GET COMPLETED ORDERS
export const getCompletedOrders = async () => {

    const res =
        await deliveryAxios.get(
            "/orders/delivery/completed"
        );

    return res.data;
};

export default deliveryAxios;
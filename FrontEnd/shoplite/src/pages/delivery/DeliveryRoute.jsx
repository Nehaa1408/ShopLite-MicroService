import { Navigate } from "react-router-dom";

const DeliveryRoute = ({ children }) => {

    const token = sessionStorage.getItem("deliveryToken");
    const role = sessionStorage.getItem("deliveryRole");

    if (!token || role !== "DELIVERY") {
        return <Navigate to="/delivery" />;
    }

    return children;
};

export default DeliveryRoute;
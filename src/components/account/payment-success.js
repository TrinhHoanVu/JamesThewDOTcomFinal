import React, { useEffect } from "react";
import "../../css/account/payment-success.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentConfirmation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const orderId = queryParams.get("token");

        const capturePayment = async (orderId) => {
            try {
                const response = await axios.post("http://localhost:5231/api/SubscriptionPayment/capture-payment", {
                    orderId,
                });
                console.log("Payment captured successfully:", response.data);
                const { token, refreshToken } = response.data;
                const inforToken = JSON.stringify({ token, refreshToken });
                localStorage.setItem("inforToken", inforToken);

            } catch (error) {
                console.log("Error payment: ", error);
            }
        };

        if (orderId) {
            capturePayment(orderId);
        }
    }, [])

    const handleRedirect = () => {
        try {
            const previousPage = localStorage.getItem("previousPage");
            if (previousPage) {
                navigate(previousPage, { replace: true });
                window.location.reload();
                localStorage.removeItem("previousPage");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="payment-confirmation-container">
            <div className="payment-confirmation-box">
                <h1>Payment Successful!</h1>
                <p>
                    Thank you for your payment. Your subscription is now active, and
                    you can enjoy all the benefits of our service.
                </p>
                <button onClick={handleRedirect} className="confirmation-button">
                    Go to Previous Page
                </button>
            </div>
        </div>
    );
};

export default PaymentConfirmation;

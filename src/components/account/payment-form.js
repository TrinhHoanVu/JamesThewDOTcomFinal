import React, { useState } from 'react'
import axios from "axios";

function PaymentForm({ user }) {
    const [paymentOption, setPaymentOption] = useState("monthly");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const calculateAmountPayment = () => {
        return paymentOption === 'yearly' ? 100 : 10
    }

    const createPayment = async () => {
        try {
            setLoading(true);
            localStorage.setItem("previousPage", window.location.pathname + window.location.search);

            const response = await axios.post("http://localhost:5231/api/SubscriptionPayment/create-payment", {
                Amount: calculateAmountPayment(),
                Username: user.name,
                email: user.email
            });

            const approvalLink = response.data.approvalUrl;
            console.log("abc" + approvalLink)

            if (approvalLink) {
                window.location.href = approvalLink;
            }
        } catch (error) {
            console.error("Error creating PayPal payment", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="signup-form-group">
            <label>Payment Options:</label>
            <div className="signup-payment-options">
                <label className="signup-payment-options-label">
                    <input
                        type="radio"
                        name="payment"
                        value="monthly"
                        checked={paymentOption === "monthly"}
                        onChange={(e) => setPaymentOption(e.target.value)}
                    />
                    <span style={{ marginTop: "7px" }}>Monthly ($10)</span>
                </label>
                <label className="signup-payment-options-label">
                    <input
                        type="radio"
                        name="payment"
                        value="yearly"
                        checked={paymentOption === "yearly"}
                        onChange={(e) => setPaymentOption(e.target.value)}
                    />
                    <span style={{ marginTop: "7px" }}>Yearly ($100)</span>
                </label>
            </div>
            <p></p>
            <button className="signup-submit-button" onClick={createPayment}>Submit</button>

            {error && <p className="signup-error">{paymentOption}</p>}
        </div>
    )
}

export default PaymentForm
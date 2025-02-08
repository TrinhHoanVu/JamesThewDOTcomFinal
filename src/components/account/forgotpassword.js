import React, { useState } from "react";
import axios from "axios";
import "../../css/account/forgot-password.css";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5231/api/Account/RequestResetPassword",
                { email },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            navigate("/confirmcode", { state: { linkNavigate: "/resetpassword" } })
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            setMessage(errorMessage);
        }
    };


    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h1 className="forgotpassowrd-title">Forgot Password</h1>
                <form onSubmit={handleForgotPassword}>
                    <div className="forgot-password-form-group">
                        <label className="forgot-password-label">Email:</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="forgot-password-input"
                        />
                    </div>
                    {message && <p className="message">{message}</p>}

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

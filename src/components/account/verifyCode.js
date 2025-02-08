import React, { useState } from "react";
import axios from "axios";
import "../../css/account/verifycode.css";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyCode = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { linkNavigate, name, email, password } = location.state || {};

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5231/api/Account/VerifyCode",
                { verifyCode: verificationCode },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );
            if (linkNavigate === "/login") {
                try {
                    await axios.post("http://localhost:5231/api/Account/register", { email: email, name: name, password: password, cfPassword: password })
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Verification failed. Please try again.";
                    setMessage(errorMessage)
                }
            }
            console.log(linkNavigate)
            navigate(linkNavigate);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Verification failed. Please try again.";
            setMessage(errorMessage);
        }
    };

    return (
        <div className="verify-code-container">
            <div className="verify-code-box">
                <h1>Verify Code</h1>
                <form onSubmit={handleVerifyCode}>
                    <div className="form-group">
                        <label>Enter Verification Code:</label>
                        <input
                            type="text"
                            placeholder="Enter the code sent to your email"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </div>
                    <span className="notiMessageConfirm">We have sent a verification code to your email. This code is valid for 2 minutes</span>
                    <button type="submit" className="submit-button">
                        Verify
                    </button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default VerifyCode;

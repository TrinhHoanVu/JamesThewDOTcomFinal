import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/account/resetpassword.css";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            await axios.put(
                "http://localhost:5231/api/Account/ChangePassword",
                {
                    NewPass: newPassword,
                    NewPassCf: confirmPassword,
                },
                { withCredentials: true, }
            );

            navigate("/homepage")

        } catch (error) {
            const errorMessage = error.response?.data.message || "An error occurred. Please try again.";
            setMessage(errorMessage);
        }
    };


    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h1>Reset Password</h1>
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="message">{message}</p>}
                    <button type="submit" className="submit-button">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
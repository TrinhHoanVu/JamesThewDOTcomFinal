import React, { useState } from "react";
import axios from "axios";
import "../../css/account/sign-up.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cfPassword, setCfPassword] = useState("");
    const [name, setName] = useState("");
    const [paymentOption, setPaymentOption] = useState("monthly");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[a-zA-Z0-9]{8,16}$/;

        try {
            if (!name.trim()) {
                errors.name = "Name cannot be empty.";
            }
            if (!emailRegex.test(email)) {
                errors.email = "Invalid email format.";
            }
            if (!passwordRegex.test(password)) {
                errors.password =
                    "Password must be 8-16 characters and contain only letters and numbers.";
            }
            if (cfPassword !== password) {
                errors.cfPassword = "Passwords do not match.";
            }
            if (!paymentOption) {
                errors.paymentOption = "Please select a payment option.";
            }
        } catch (err) {
            console.log(err)
        }
        return errors;
    };



    const handleSignUp = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        try {
            e.preventDefault();
            await axios.post("http://localhost:5231/api/Account/RegisterCode", { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }).then(res => {
                if (res.status === 200)
                    navigate("/confirmcode", {
                        state: {
                            linkNavigate: "/login",
                            name: name,
                            email: email,
                            password: password
                        }
                    })
            })

        } catch (eror) {
            const errMes = eror.response?.data?.message
            console.log(errMes)
            setMessage(errMes)
        }
        setErrors({});

    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1 className="forgotpassowrd-title">Welcome to JamesThew's Kitchen!</h1>
                <div className="signup-form-group">
                    <label className="signup-label">Name:</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="signup-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="signup-error">{errors.name}</p>}
                </div>
                <div className="signup-form-group">
                    <label className="signup-label">Email:</label>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        className="signup-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {message ? (
                        <p className="signup-error">{message}</p>
                    ) : errors.email ? (
                        <p className="signup-error">{errors.email}</p>
                    ) : null}
                </div>
                <div className="signup-form-group">
                    <label className="signup-label">Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="signup-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="signup-error">{errors.password}</p>}
                </div>
                <div className="signup-form-group">
                    <label className="signup-label">Confirm Password:</label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        className="signup-input"
                        value={cfPassword}
                        onChange={(e) => setCfPassword(e.target.value)}
                    />
                    {errors.cfPassword && <p className="signup-error">{errors.cfPassword}</p>}
                </div>

                <button type="submit" className="signup-submit-button" onClick={handleSignUp}>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default SignUp;
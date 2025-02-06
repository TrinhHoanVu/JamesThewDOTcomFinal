import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../context/DatabaseContext";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

function PasswordManagement() {
    const { tokenInfor } = useContext(DataContext);
    const [loggedUser, setLoggedUser] = useState([]);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchAccountData();
    }, []);

    const fetchAccountData = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Account/${tokenInfor.email}`);
            setLoggedUser(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            let validationErrors = {};

            if (!currentPassword) {
                validationErrors.currentPassword = "Current password is required.";
            }
            if (currentPassword !== loggedUser.password) {
                validationErrors.currentPassword = "Current password is invalid.";
            }
            if (newPassword === loggedUser.password) {
                validationErrors.newPassword = "New password must be different from the current password.";
            }
            if (!newPassword) {
                validationErrors.newPassword = "New password is required.";
            } else if (newPassword.length < 8 || newPassword.length > 20 || /[^a-zA-Z0-9]/.test(newPassword)) {
                validationErrors.newPassword = "Password must be 8-20 characters long with no special characters.";
            }
            if (newPassword !== confirmNewPassword) {
                validationErrors.confirmPassword = "Passwords do not match.";
            }

            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) return;


            await axios.put(`http://localhost:5231/api/Account/ChangePasswordWithoutCode`, {
                email: tokenInfor.email,
                currentPassword,
                newPassword
            });
            Swal.fire({
                icon: 'success',
                title: 'Password Updated Successfully',
                text: 'Your password has been updated successfully.',
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Update Password',
                text: 'There was an error updating your password. Please try again.',
            });
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleClear = () => {
        try {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setErrors({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-box">
                <h1 className="title">Password and Security</h1>
                <p className="subtitle">Manage your account information</p>
                <div className="form-group">
                    <label htmlFor="current-password">Current Password
                        {errors.currentPassword && <span className="error-message" style={{ marginLeft: '20px', color: 'red' }}>
                            {errors.currentPassword}
                        </span>}</label>
                    <div className="password-input">
                        <input
                            type={showPassword.current ? "text" : "password"}
                            id="current-password"
                            name="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <span className="toggle-password"
                            style={{ position: 'absolute', top: '27%', right: '170px', transform: 'translateY(-50%)' }}
                            onClick={() => togglePasswordVisibility("current")}>
                            {showPassword.current ? <EyeOff /> : <Eye />}
                        </span>
                    </div>

                </div>

                <div className="form-group">
                    <label htmlFor="new-password">New Password
                        {errors.newPassword && <span className="error-message" style={{ marginLeft: '20px', color: 'red' }}>
                            {errors.newPassword}</span>}
                    </label>
                    <div className="password-input">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            id="new-password"
                            name="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span className="toggle-password"
                            style={{ position: 'absolute', top: '38.5%', right: '170px', transform: 'translateY(-50%)' }}
                            onClick={() => togglePasswordVisibility("new")}>
                            {showPassword.new ? <EyeOff /> : <Eye />}
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm New Password
                        {errors.confirmPassword && <span className="error-message" style={{ marginLeft: '20px', color: 'red' }}>
                            {errors.confirmPassword}</span>}
                    </label>
                    <div className="password-input">
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            id="confirm-password"
                            name="confirm-password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <span className="toggle-password"
                            style={{ position: 'absolute', top: '50%', right: '170px', transform: 'translateY(-50%)' }}
                            onClick={() => togglePasswordVisibility("confirm")}>
                            {showPassword.confirm ? <EyeOff /> : <Eye />}
                        </span>
                    </div>
                </div>
                <br /><br />


                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '10px' }}>
                    <button type="submit" className="profile-button" onClick={handleClear}>
                        Cancel
                    </button>
                    <button type="submit" className="profile-button" onClick={handleUpdatePassword}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PasswordManagement;
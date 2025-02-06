import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "../../css/tip/tip-detail.css";
import axios from "axios";
import NotFoundPage from '../notFoundPage.js';
import { DataContext } from "../../context/DatabaseContext";
import PaymentForm from '../account/payment-form';
import Swal from 'sweetalert2';

function TipDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tip, setTip] = useState(null);
    const [description, setDescription] = useState("");
    const [user, setUser] = useState(null);
    const { tokenInfor } = useContext(DataContext);
    const [payment, setPayment] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (id) {
            fetchTip();
            fetchUser();
        } else {
            console.error("Invalid tip ID.");
        }
    }, [id]);

    const fetchTip = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Tips/getSpecificTip", { params: { idTip: id } });
            setTip(response.data);
            setDescription(response.data.decription);
        } catch (err) {
            console.log("Tip not found");
            setTip(null);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Account/${tokenInfor.email}`);
            if (response) {
                setUser(response.data);
            }
        } catch (error) {
            console.log(error);
            showLoginAlert();
        }
    };

    const showLoginAlert = () => {
        Swal.fire({
            title: "You are not logged in",
            text: "You need to log in to view this content.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/login", { state: { from: location.pathname } });
            }
        });
    };

    const renderDescription = (description) => {
        if (typeof description === 'string') {
            return description.split("\\n").map((item, key) =>
                <span key={key}>{item}<br /></span>
            );
        }
        return "";
    };

    const handlePayment = () => {
        setPayment(true);
    };

    const handleBackToTipPage = () => {
        navigate("/tips")
    }

    if (!tip) {
        return <NotFoundPage />;
    }

    const userRole = user?.role;
    if (userRole === "SUPERADMIN" || userRole === "ADMIN") {
        return (
            <div className="contestdt-container">
                <div className="contestdt-details">
                    <img src={tip.images} alt={tip.name} className="contestdt-image" />
                    <h1 className="contestdt-title">{tip.name}</h1>
                    <div className="contestdt-info">
                        <p className="contestdt-description">{renderDescription(description)}</p>
                        <span>Posted by: {tip.account.name}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (userRole === "USER") {
        return (
            <div className="contestdt-container">
                {user?.status ? (
                    <div className="contestdt-details">
                        <img src={tip.images} alt={tip.name} className="contestdt-image" />
                        <h1 className="contestdt-title">{tip.name}</h1>
                        <div className="contestdt-info">
                            <p className="contestdt-description">{renderDescription(description)}</p>
                            <span>Posted by: {tip.account.name}</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>
                            This page is for members only. You need to register to view the content. <br />
                            Click <span style={{ color: "orange", cursor: "pointer" }} onClick={handlePayment}>here</span> to register.
                        </p>
                    </div>
                )}
                {payment && (<div className="cmtForm-overlay">
                    <div className="cmtForm-payment-box">
                        <button className="cmtForm-close-button" onClick={() => handleBackToTipPage()}>✖</button>
                        <h4 className="cmtForm-message">Your account is not active. Please subcribe to comment.</h4>
                        <PaymentForm user={user} />
                    </div>
                </div>)}
            </div>
        );
    }

    return null;
}

export default TipDetail;

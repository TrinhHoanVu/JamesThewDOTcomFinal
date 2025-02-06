import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/notFoundPage.css";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1 className="notfound-title">404</h1>
                <p className="notfound-message">Oops! The page you're looking for doesn't exist.</p>
                <button className="notfound-button" onClick={handleGoHome}>
                    Go to Homepage
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;

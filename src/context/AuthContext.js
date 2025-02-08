import React, { createContext, useState, useEffect } from "react";

// Tạo Context
export const AuthContext = createContext(); 

const AuthProvider = ({ children }) => {
    const [tokenInfor, setTokenInfor] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setTokenInfor(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (token, userData) => {
        setTokenInfor(token);
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setTokenInfor(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ tokenInfor, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

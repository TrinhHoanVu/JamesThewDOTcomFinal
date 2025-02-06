import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

export const DataContext = createContext();
export const DataProvider = ({ children }) => {
    function checkTokenLocal() {
        const tokenLocal = localStorage.getItem("inforToken");
        try {
            const parsed = JSON.parse(tokenLocal);
            if (parsed !== null && typeof parsed === "object") {
                if (parsed?.token) {
                    return jwtDecode(parsed.token);
                }
            }
            return null;
        } catch (error) {
            console.log("error: ", error);
            return null;
        }
    }
    const [tokenInfor, setTokenInfor] = useState(checkTokenLocal());

    const dataStore = {
        tokenInfor,
        setTokenInfor
    };
    return (
        <DataContext.Provider value={dataStore}>{children}</DataContext.Provider>
    );
};

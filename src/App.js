import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "./context/DatabaseContext";
import { publicRouter, privateRouter, evaluateRouter } from "./configs/routerConfig";
import './index.css';

function App() {
  const { tokenInfor } = useContext(DataContext);
  return (
    <div className="container">
      <Routes>
        {publicRouter.map((item, index) => {
          return <Route key={index} path={item.path} element={item.element} />;
        })}
        {privateRouter.map((item, index) => (
          <Route
            key={index}
            path={item.roles.includes(tokenInfor?.role) ? item.path : "*"}
            element={
              item.roles.includes(tokenInfor?.role) ? (
                item.element
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        ))}
        {evaluateRouter.map((item, index) => (
          <Route
            key={index}
            path={item.roles.includes(tokenInfor?.role) ? item.path : "*"}
            element={
              item.roles.includes(tokenInfor?.role) ? (
                item.element
              ) : (
                (tokenInfor?.role) == "USER" ? (<Navigate to="/" />) : (<Navigate to="/login" />)
              )
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;

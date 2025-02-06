import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../css/account/login.css";
import { DataContext } from "../../context/DatabaseContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { tokenInfor, setTokenInfor } = useContext(DataContext)
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5231/api/Account/login", { email, password })
        .then(res => {
          if (res.status === 200) {
            console.log("res: ", res);

            localStorage.setItem("inforToken", JSON.stringify(res.data));
            let tokenDecode = jwtDecode(res.data.token);
            console.log("tokenDecode: ", tokenDecode);
            setTokenInfor(tokenDecode)
            const allowedRoles = ["SUPERADMIN", "ADMIN"];
            
            if (allowedRoles.includes(tokenDecode.role)) {
              if (from === "/") {
                navigate("/management", { state: { isProfile: true, isContest: false, isRecipe: false, isTip: false } });
              } else {
                navigate(from)
              }
            } else {
              navigate(from)
            }

          }
        })
        .catch(err => {
          const errMes = err.response?.data?.message
          setErrorMessage(errMes)
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">🍳 Cooking Login</h1>
        <p className="subtitle">Welcome to JamesThew's Kitchen!</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="message">{errorMessage}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="extra-options">
          <p onClick={() => navigate("/forgot-password")}>
            Forgot your password?
          </p>
          <p onClick={() => navigate("/sign-up")}>
            Don't have an account?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

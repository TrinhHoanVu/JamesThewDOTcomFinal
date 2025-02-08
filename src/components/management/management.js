import React, { useState, useEffect, useContext } from "react";
import "../../css/management/management.css";
import { DataContext } from "../../context/DatabaseContext";
import { useNavigate, useLocation } from "react-router-dom";
import AccountDetail from "./accountDetail";
import ContestManagement from "./contestmanagement";
import TipManagement from "./tipmanagement";
import RecipeManagement from "./recipemanagement";
import PasswordManagement from "./passwordManagement";


const Management = () => {
  const location = useLocation();
  const { tokenInfor } = useContext(DataContext);
  const storedTab = localStorage.getItem("managementTab");

  const { isProfile, isContest, isRecipe, isTip, isPassword } = location.state || {
    isProfile: storedTab === "profile",
    isContest: storedTab === "contest",
    isRecipe: storedTab === "recipe",
    isTip: storedTab === "tip",
    isPassword: storedTab === "password"
  };
  const [contestStatus, setContestStatus] = useState(isContest);
  const [tipStatus, setTipStatus] = useState(isTip);
  const [recipeStatus, setRecipeStatus] = useState(isRecipe);
  const [profileStatus, setProfileStatus] = useState(isProfile);
  const [passwordStatus, setPasswordStatus] = useState(isPassword);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (storedTab === "tip") {
        handleChangeTip();
      } else if (storedTab === "contest") {
        handleChangeContest();
      } else if (storedTab === "recipe") {
        handleChangeRecipe();
      } else if (storedTab === "profile") {
        handleChangeProfile();
      } else if (storedTab === "password") {
        handleChangePassword();
      } else {
        if (isContest) {
          handleChangeContest();
        } else if (isRecipe) {
          handleChangeRecipe();
        } else if (isTip) {
          handleChangeTip();
        } else if (isPassword) {
          handleChangePassword();
        } else {
          handleChangeProfile();
        }
      }
      localStorage.removeItem("managementTab");
    } catch (err) { console.log(err) }
  }, [isProfile, isContest, isRecipe, isTip, isPassword]);

  const handleChangeContest = () => {
    setContestStatus(true);
    setRecipeStatus(false);
    setTipStatus(false)
    setProfileStatus(false)
    setPasswordStatus(false)
  }

  const handleChangePassword = () => {
    setContestStatus(false);
    setRecipeStatus(false);
    setTipStatus(false)
    setProfileStatus(false)
    setPasswordStatus(true)
  }

  const handleChangeRecipe = () => {
    setContestStatus(false);
    setRecipeStatus(true);
    setTipStatus(false)
    setProfileStatus(false)
    setPasswordStatus(false)
  }

  const handleChangeTip = () => {
    setContestStatus(false);
    setRecipeStatus(false);
    setTipStatus(true)
    setProfileStatus(false)
    setPasswordStatus(false)
  }

  const handleChangeProfile = () => {
    setContestStatus(false);
    setRecipeStatus(false);
    setTipStatus(false)
    setProfileStatus(true)
    setPasswordStatus(false)
  }

  const logOut = () => {
    localStorage.removeItem("inforToken");
    navigate("/login")
  }
  return (
    <div className="manage-panel">
      <div className="management-slide">
        <div className="management-title">MANAGEMENT</div>
        <div className="management-slide-option">
          <div className="management-item" onClick={handleChangeProfile}>Profile</div>
          <div className="management-item" onClick={handleChangePassword}>Password</div>
          {tokenInfor.role !== "USER" && (<div className="management-item" onClick={handleChangeContest}>Contest</div>)}
          {tokenInfor.role !== "USER" && (<div className="management-item" onClick={handleChangeRecipe}>Recipe</div>)}
          {tokenInfor.role !== "USER" && (<div className="management-item" onClick={handleChangeTip}>Tip</div>)}
          <div className="management-item" onClick={logOut}>Log out</div>
        </div>
      </div>
      <div className="management-function">
        {profileStatus && (<div><AccountDetail /></div>)}
        {passwordStatus && (<div><PasswordManagement /></div>)}
        {contestStatus && (<div><ContestManagement /></div>)}
        {recipeStatus && (<div><RecipeManagement /></div>)}
        {tipStatus && (<div><TipManagement /></div>)}
      </div>
    </div>
  );
};

export default Management;

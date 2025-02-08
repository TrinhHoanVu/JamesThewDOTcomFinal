import React from "react";
import { useNavigate } from "react-router-dom";
const MealItem=({data})=>{
    console.log(data);
    let navigate = useNavigate();
    const storedToken = JSON.parse(localStorage.getItem("inforToken"));
    const userRole = storedToken ? storedToken.role : null;
    return(
        <>  
            {
                (!data) ?"Not Found": data.map(item=>{
                    return(
                    <div className="card" key={item.idMeal} onClick={()=>navigate(`/recipe/${item.idMeal}`)}>
                        <img src={item.strMealThumb} alt="" />
                        <h3>{item.strMeal}</h3>
                        
                        {userRole === "ADMIN" && (
                        <button 
                                    className="edit-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/recipe-edit/${item.idMeal}`);
                                    }}
                                >
                                    Edit Recipe
                                </button>
                         )} 
                    </div>
                    )
                })
            }
            
        </>
    )
}
export default MealItem;
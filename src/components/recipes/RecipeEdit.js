import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

const RecipeEdit = () => {
    const { idMeal } = useParams(); // Get the recipe ID from the URL
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [editedMeal, setEditedMeal] = useState({
        strMeal: "",
        strCategory: "",
        strArea: "",
        strInstructions: "",
        strIngredient1: "",
        strMeasure1: "",
        strMealThumb: "", // Thêm trường để chứa URL của hình ảnh
    });

    const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));

    useEffect(() => {
        // Kiểm tra xem người dùng có đăng nhập chưa
        if (!isLoggedIn) {
            navigate("/login"); // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
        }
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
            .then((res) => res.json())
            .then((data) => {
                const meal = data.meals ? data.meals[0] : null;
                setRecipe(meal);
                if (meal) {
                    // Populate the form with the current recipe data
                    setEditedMeal({
                        strMeal: meal.strMeal,
                        strCategory: meal.strCategory,
                        strArea: meal.strArea,
                        strInstructions: meal.strInstructions,
                        strIngredient1: meal.strIngredient1,
                        strMeasure1: meal.strMeasure1,
                        strMealThumb: meal.strMealThumb, // Cập nhật hình ảnh vào state
                    });
                }
            });
    }, [idMeal]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedMeal((prevMeal) => ({
            ...prevMeal,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Example: Show an alert or you can implement an API call to save the changes
        alert("Recipe updated successfully!");
        
        // Redirect back to the recipe page after submitting
        navigate(`/${idMeal}`);
    };

    if (!recipe) {
        return <p>Loading...</p>;
    }

    return (
        <div className="recipe-edit-container">
            <h1>Edit Recipe</h1>
            <form onSubmit={handleSubmit}>
                {/* Display current image */}
                <div className="form-group">
                    <label>Current Image:</label>
                    <img src={editedMeal.strMealThumb} alt={editedMeal.strMeal} style={{ width: "100px", height: "auto" }} />
                </div>
                
                {/* Optional: Input for a new image URL */}
                <div className="form-group">
                    <label htmlFor="strMealThumb">Change Image URL:</label>
                    <input
                        type="text"
                        id="strMealThumb"
                        name="strMealThumb"
                        value={editedMeal.strMealThumb}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="strMeal">Dish Name:</label>
                    <input
                        type="text"
                        id="strMeal"
                        name="strMeal"
                        value={editedMeal.strMeal}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="strCategory">Category:</label>
                    <input
                        type="text"
                        id="strCategory"
                        name="strCategory"
                        value={editedMeal.strCategory}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="strArea">Area:</label>
                    <input
                        type="text"
                        id="strArea"
                        name="strArea"
                        value={editedMeal.strArea}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="strInstructions">Instructions:</label>
                    <textarea
                        id="strInstructions"
                        name="strInstructions"
                        value={editedMeal.strInstructions}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Ingredients */}
                <div className="form-group">
                    <label htmlFor="strIngredient1">Ingredient 1:</label>
                    <input
                        type="text"
                        id="strIngredient1"
                        name="strIngredient1"
                        value={editedMeal.strIngredient1}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        id="strMeasure1"
                        name="strMeasure1"
                        value={editedMeal.strMeasure1}
                        onChange={handleChange}
                    />
                </div>
                {/* Add more ingredients as needed... */}

                <button type="submit" className="submit-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default RecipeEdit;

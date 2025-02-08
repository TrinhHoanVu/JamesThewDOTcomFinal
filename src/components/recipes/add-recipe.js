import React, { useState, useEffect, useRef, useContext } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import axios from "axios";
import Swal from 'sweetalert2';
import { DataContext } from "../../context/DatabaseContext";
import IngredientCard from "./ingredient-card";

function AddRecipe({ onClose, reloadTips, IsApproved, title = 'Add recipe successfully!' }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(() => EditorState.createEmpty());
    const [recipeNameList, setRecipeNameList] = useState([]);
    const { tokenInfor } = useContext(DataContext);
    const [isPublic, setIsPublic] = useState(true);
    const [initialIngredients, setInitialIngredients] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [admin, setAdmin] = useState([]);
    const [loadingPost, setLoadingPost] = useState(false);

    const editorRef = useRef();

    const focus = () => {
        editorRef.current.focus();
    };

    useEffect(() => {
        fetchCurrentAdmin()
        fetchRecipeNames()
        fetchIngredients()
    }, [])

    const fetchRecipeNames = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Recipe/getAllRecipeNames")
            setRecipeNameList(response.data.$values)
        } catch (err) { console.log(err) }
    }

    const fetchCurrentAdmin = async () => {
        try {
            const respone = await axios.get(`http://localhost:5231/api/Account/${tokenInfor.email}`);
            setAdmin(respone.data)
            console.log(admin)
        } catch (error) { console.log(error) }
        finally {
            setLoading(false);
        }
    }

    const fetchIngredients = async () => {
        try {
            const resonse = await axios.get("http://localhost:5231/api/Recipe/getAllIngredientNames")

            setInitialIngredients(resonse.data.$values)
            setIngredients(resonse.data.$values)
            console.log("asdsad" + initialIngredients)
            console.log(ingredients)
        } catch (err) { console.log(err) }
    }

    const handleIngredientSelect = (ingredient) => {
        try {
            if (!selectedIngredients.includes(ingredient)) {
                setSelectedIngredients([...selectedIngredients, ingredient]);
            }
            setShowDropdown(false);
        } catch (err) { console.log(err) }
    };

    const validate = () => {
        const errors = {};
        try {
            console.log(recipeNameList)
            if (!name.trim()) errors.name = "Name is required.";
            if (recipeNameList.includes(name)) errors.name = "This name has already taken.";
            if (!description.getCurrentContent().hasText()) errors.description = "Description is required.";
        } catch (err) { console.log(err) }
        return errors;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            try {
                const descriptionText = description.getCurrentContent().getPlainText();
                setLoadingPost(true)
                await axios.post("http://localhost:5231/api/Recipe/addRecipe", {
                    Name: name.trim(),
                    Description: descriptionText,
                    IsPublic: isPublic,
                    IsApproved: IsApproved,
                    IdAccountPost: admin.idAccount
                })

                setLoadingPost(false)
                localStorage.setItem("managementTab", "recipe");
                Swal.fire({
                    icon: 'success',
                    title: title,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.reload();
                });

                if (reloadTips) {
                    await reloadTips();
                }
                if (onClose) {
                    onClose();
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to add Recipe',
                    text: 'Please try again later.',
                });

            }
        } catch (er) { console.log(er) }
    };

    const handleIngredientRemove = (ingredient) => {
        setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{
            width: "1000px", margin: "0 auto", padding: "10px", display: "flex",
            justifyContent: "center", gap: "20px"
        }}>
            <div style={{ width: "500px" }}>
                <div style={{ marginBottom: "45px", height: "50px", }}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
                </div>
                <div style={{ marginBottom: "45px", height: "50px" }}>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={isPublic ? "true" : "false"}
                        onChange={(e) => setIsPublic(e.target.value === "true")}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    >
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                    </select>
                </div>
                <div style={{ marginBottom: "45px", height: "50px" }}>
                    <label htmlFor="status">Ingredients:</label>
                    <div className="ingredient-card-wrapper">
                        {selectedIngredients.length > 0 ? (
                            selectedIngredients.map((ingredient, index) => (
                                <IngredientCard key={index} name={ingredient} handleIngredientRemove={handleIngredientRemove} />
                            ))
                        ) : ""}
                    </div>
                    <br />
                    <div onClick={() => setShowDropdown(!showDropdown)} style={{ border: "1px solid #ccc", padding: "10px", cursor: "pointer" }}>
                        {selectedIngredients.length > 0 ? selectedIngredients.join(", ") : "Select ingredients"}
                    </div>
                    {showDropdown && (
                        <div style={{ border: "1px solid #ccc", maxHeight: "110px", overflowY: "auto" }}>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} onClick={() => handleIngredientSelect(ingredient)} style={{ padding: "5px", cursor: "pointer" }}>
                                    {ingredient}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div style={{
                marginBottom: "15px", display: "flex",
                justifyContent: "center", flexDirection: "column", gap: "20px"
            }}>
                <label htmlFor="description">Description: {errors.description && <span style={{ color: "red" }}>{errors.description}</span>}
                </label>
                <div style={{
                    border: "1px solid #ddd",
                    height: "340px",
                    padding: "10px",
                    width: "500px",
                    overflow: "auto",
                    backgroundColor: "#fff"
                }} onClick={focus}>
                    <Editor
                        ref={editorRef}
                        editorState={description}
                        onChange={(editorState) => setDescription(editorState)}
                    />
                </div>

                <button
                    onClick={handleSave}
                    style={{ padding: "10px 20px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    Save
                </button>
                {loadingPost && <div style={{ marginTop: "10px", color: "blue" }}>Saving contest, please wait...</div>}
            </div>
        </div>
    );
}

export default AddRecipe;

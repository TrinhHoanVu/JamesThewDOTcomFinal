import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, ContentState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import axios from "axios";
import Swal from 'sweetalert2';

function RecipeEditForm({ idTip, onClose, reloadTips }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(() => EditorState.createEmpty());
    const [isPublic, setIsPublic] = useState(true);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingPost, setLoadingPost] = useState(false);

    const editorRef = useRef();

    const focus = () => {
        try {
            editorRef.current.focus();
        } catch (er) { console.log(er) }
    };

    const fetchTip = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Recipe/detail/${idTip}`);
            const tip = response.data.contest;

            setName(tip.name);
            setIsPublic(tip.isPublic)

            if (tip.decription) {
                try {
                    const contentState = convertFromRaw(JSON.parse(tip.decription));
                    setDescription(EditorState.createWithContent(contentState));
                } catch (e) {
                    const contentState = ContentState.createFromText(tip.decription);
                    setDescription(EditorState.createWithContent(contentState));
                }
            }

            setLoading(false);
        } catch (err) {
            setError("Failed to load tip details.");
            setLoading(false);
        }
    };

    const validate = () => {
        const errors = {};
        try {
            if (!name.trim()) errors.name = "Name is required.";
            if (!description.getCurrentContent().hasText()) errors.description = "Description is required.";
        } catch (err) { console.log(err) }
        return errors;
    };

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
                await axios.put(`http://localhost:5231/api/Tips/update/${idTip}`, {
                    name,
                    description: descriptionText,
                    isPublic: isPublic
                });

                setLoadingPost(false)

                localStorage.setItem("managementTab", "tip");
                Swal.fire({
                    icon: 'success',
                    title: 'Tip updated successfully!',
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
                    title: 'Failed to update Tip',
                    text: 'Please try again later.',
                });
                setLoading(false)
            }
        } catch (er) { console.log(er) }
    };

    useEffect(() => {
        fetchTip();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{
            maxWidth: "1000px", minWidth: "1000px", margin: "0 auto", padding: "10px", display: "flex",
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
                <div style={{
                    marginBottom: "15px", display: "flex",
                    justifyContent: "center", flexDirection: "column", gap: "20px"
                }}>
                    <label htmlFor="description">Description:</label>
                    <div style={{
                        border: "1px solid #ddd",
                        height: "250px",
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
                    {errors.description && <span style={{ color: "red" }}>{errors.description}</span>}

                    <button
                        onClick={handleSave}
                        style={{ padding: "10px 20px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        Save
                    </button>
                    {loadingPost && <div style={{ marginTop: "10px", color: "blue" }}>Saving Tip, please wait...</div>}
                </div>
            </div>
        </div>
    );
}

export default RecipeEditForm;

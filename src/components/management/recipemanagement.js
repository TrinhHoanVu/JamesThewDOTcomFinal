import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import "datatables.net";
import "../../css/management/tip-magenement.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Swal from 'sweetalert2';
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import AddRecipe from "../recipes/add-recipe";
import RecipeEditForm from "./recipe-edit"


function useThrottledResizeObserver(callback, delay = 200) {
    const resizeObserverRef = useRef(null);
    const throttledCallbackRef = useRef(null);

    useEffect(() => {
        throttledCallbackRef.current = (entries) => {
            clearTimeout(resizeObserverRef.current);
            resizeObserverRef.current = setTimeout(() => {
                callback(entries);
            }, delay);
        };

        const observer = new ResizeObserver(throttledCallbackRef.current);
        const elementsToObserve = document.querySelectorAll('.contest-management-container');

        elementsToObserve.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
            clearTimeout(resizeObserverRef.current);
        };
    }, [callback, delay]);

    return resizeObserverRef;
}

function RecipeManagement() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accountPostNameList, setAccountPostNameList] = useState(new Map());
    const [editTable, setEditTable] = useState(false);
    const [idRecipe, setIdRecipe] = useState(0);
    const [addRecipeTable, setAddRecipeTable] = useState(false);
    const [checkedState, setCheckedState] = useState();
    const [selectedRecipe, setSelectedRecipe] = useState([]);
    const [deleteReason, setDeleteReason] = useState("");

    const navigate = useNavigate();

    useThrottledResizeObserver(() => {
        try {
            if (recipes.length > 0) {
                setTimeout(() => {
                    $("#contestTable").DataTable();
                }, 500);
            }
        } catch (err) { console.log(err) }
    });

    useEffect(() => {
        try {
            if (recipes.length > 0) {
                setTimeout(() => {
                    $("#contestTable").DataTable({
                        destroy: true,
                        pageLength: 5,
                        lengthMenu: [5, 10],
                    });
                }, 500);
            }
            setCheckedState(new Array(recipes.length).fill(false));
        } catch (err) {
            console.log(err);
        }
    }, [recipes]);

    useEffect(() => {
        try {
            fetchRecipe();
            fetchAccountPost()
        } catch (err) { console.log(err) }
    }, []);

    const fetchRecipe = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Recipe/getAll");
            let contestData = response.data.data.$values || [];

            const objectMap = {};

            contestData.forEach((contest) => {
                if (contest.account && contest.account.$ref) {
                    const accountId = contest.account.$ref;
                    if (!objectMap[accountId]) {
                        objectMap[accountId] = contest.account;
                    }
                    contest.account = objectMap[accountId];
                }
            });

            setRecipes(contestData);
            setLoading(false);
        } catch (err) {
            setError("Failed to load contests. Please try again.");
            setLoading(false);
        }
    };

    const fetchAccountPost = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Tips/GetAllAccountIdsByRoles")
            const cleanData = Object.fromEntries(
                Object.entries(response.data).filter(([key]) => key !== "$id")
            );
            const cleanDataMap = new Map(
                Object.entries(cleanData).map(([key, value]) => [Number(key), value])
            );
            setAccountPostNameList(cleanDataMap)
        } catch (err) { console.log(err) }
    }

    const handleEdit = (idRecipe) => {
        setEditTable(true)
        setIdRecipe(idRecipe)
    }

    const handleDelete = (idRecipe, name, idAccountPost) => {
        try {
            Swal.fire({
                title: `Delete ${name}?`,
                text: "Please provide a reason for deletion.",
                icon: 'warning',
                input: 'textarea',
                inputPlaceholder: 'Enter the reason here...',
                inputAttributes: {
                    'aria-label': 'Enter the reason for deletion'
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (reason) => {
                    if (!reason) {
                        Swal.showValidationMessage('Please enter a reason');
                    }
                    return reason;
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const deleteReason = result.value;

                    try {
                        Swal.fire({
                            title: 'Deleting...',
                            text: 'Please wait while the recipe is being deleted.',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        const response = await axios.get(`http://localhost:5231/api/Account/getEmailAccount/${idAccountPost}`)

                        await axios.delete(`http://localhost:5231/api/Recipe/delete/${idRecipe}`);

                        let subject = "Your recipe has been deleted!!!"
                        let body = `Hi there. We announce that your recipe has been rejected since ${deleteReason}`

                        await axios.post("http://localhost:5231/api/Contest/sendNewContest", {
                            To: response.data,
                            subject: subject,
                            Body: body
                        })

                        localStorage.setItem("managementTab", "tip");
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The recipe has been deleted.',
                            icon: 'success'
                        }).then(() => {
                            window.location.reload();
                        })
                    } catch (err) {
                        Swal.fire('Error!', 'Failed to delete the contest. Please try again.', 'error');
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    const handleAddRecipe = () => {
        try {
            setAddRecipeTable(true)
        } catch (err) { console.log(err) }
    }

    const reloadRecipes = async () => {
        try {
            await fetchRecipe();
        } catch (er) { console.log(er) }
    };

    const handleClear = () => {
        setSelectedRecipe([])
        setCheckedState(new Array(recipes.length).fill(false));
    }

    const NavigateToApprovelPage = (idRecipe) => {
        navigate(`/recipe/approval`)
    }

    return (
        <div className="contest-management-body">
            <h1 className="contest-management-title">Recipe Management</h1>
            <div className="contest-management-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="contest-management-error-message">{error}</p>
                ) : (
                    <table id="contestTable" className="display" style={{ backgroundColor: "transparent" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Name</th>
                                <th>Description</th>
                                <th>Approved</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe, index) => (
                                <tr key={index}>
                                    <td>
                                        {recipe.name}
                                    </td>
                                    <td className="price" style={{ textAlign: "left" }}>
                                        {recipe.description && recipe.description.length > 350 ?
                                            recipe.description.substring(0, 350) + "..." :
                                            recipe.description || "No description available"}
                                    </td>
                                    <td>
                                        {recipe.isApproved ? "Approved" : "Not Approved"}
                                    </td>
                                    <td className="actions">
                                        <>
                                            {accountPostNameList.get(recipe.idAccountPost) !== "USER" && <FaEdit
                                                className="contest-action-icon edit-icon"
                                                onClick={() => handleEdit(recipe.idRecipe)}
                                                title="Edit"
                                                style={{ cursor: "pointer" }}
                                            />}
                                            <FaTrash
                                                className="contest-action-icon delete-icon"
                                                onClick={() => handleDelete(recipe.idRecipe, recipe.name, recipe.idAccountPost)}
                                                title="Delete"
                                                style={{ cursor: "pointer", marginLeft: "20px" }}
                                            />
                                        </>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                    <button className="compare-button" onClick={() => handleAddRecipe()}><FaPlus /> Add</button>
                    <button className="compare-button" onClick={() => NavigateToApprovelPage()}><FaCheck /> Approve</button>
                    <button className="compare-button" onClick={() => handleClear()}><FaTimes /> Clear</button>
                </div>

                {editTable && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <RecipeEditForm idRecipe={idRecipe} onClose={() => setEditTable(false)} reloadRecipes={reloadRecipes} />
                            <button className="close-modal-button" onClick={() => setEditTable(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {addRecipeTable && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <AddRecipe onClose={() => setAddRecipeTable(false)} reloadRecipes={reloadRecipes} IsApproved={true} />
                            <button className="close-modal-button" onClick={() => setAddRecipeTable(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeManagement;

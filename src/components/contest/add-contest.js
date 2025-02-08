import React, { useState, useEffect, useRef, useContext } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import axios from "axios";
import Swal from 'sweetalert2';
import { DataContext } from "../../context/DatabaseContext";



function AddContest({ onClose, reloadContests }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(() => EditorState.createEmpty());
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("NOT YET");
    const [initialStatus, setInitialStatus] = useState("");
    const [contestNameList, setContestNameList] = useState([]);
    const { tokenInfor } = useContext(DataContext);


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
        try {
            fetchCurrentAdmin()
            fetchContestNames()
            setInitialStatus("NOT YET")
        } catch (err) { console.log(err) }
    }, [])

    const fetchContestNames = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getAllContestNames")
            setContestNameList(response.data.$values)
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

    const formatDate = (date) => {
        try {
            if (!date) return '';
            const parsedDate = new Date(date);
            return parsedDate.toISOString().split('T')[0];
        } catch (err) { console.log(err) }
    };

    const formatDateText = (date) => {
        try {
            if (!date) return '';
            const parsedDate = new Date(date);
            return parsedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (err) { console.log(err) }
    };

    const handleStartDateChange = (value) => {
        try {
            setStartDate(value);

            const dateErrors = validateDate(value, endDate);
            setErrors((prevErrors) => ({
                ...prevErrors,
                startDate: dateErrors.startDate || null,
            }));
        } catch (err) { console.log(err) }
    };

    const handleEndDateChange = (value) => {
        try {
            setEndDate(value);

            const dateErrors = validateDate(startDate, value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                endDate: dateErrors.endDate || null,
            }));
        } catch (err) { console.log(err) }
    };

    const validateDate = (startDate, endDate) => {
        try {
            const errors = {};
            const now = new Date().getTime();
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();

            if (!startDate) errors.startDate = "Start date is required.";
            else if (!isNaN(start) && start < now) {
                errors.startDate = "Start date must be in the future.";
            }

            if (!endDate) errors.endDate = "End date is required.";
            else if (!isNaN(end) && end < now) {
                errors.endDate = "End date must be in the future.";
            }

            if (!isNaN(start) && !isNaN(end) && start >= end) {
                errors.endDate = "End date must be after the start date.";
            }

            return errors;
        } catch (err) { console.log(err) }
    };

    const validate = () => {
        const errors = {};
        try {
            if (!name.trim()) errors.name = "Name is required.";
            if (contestNameList.includes(name)) errors.name = "This name has already been taken.";
            if (!description.getCurrentContent().hasText()) errors.description = "Description is required.";
            if (price < 0) errors.price = "Price must be greater than or equal to 0.";
            if (!startDate) errors.startDate = "Start date is required.";
            if (!endDate) errors.endDate = "End date is required.";

            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const now = Date.now();

            if (start < now) errors.startDate = "Start date must be in the future.";
            if (end < now) errors.endDate = "End date must be in the future.";
            if (start >= end) errors.endDate = "End date must be after the start date.";
        } catch (err) { console.log(err) }
        return errors;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            console.log(status)
            console.log(initialStatus)
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            try {
                const descriptionText = description.getCurrentContent().getPlainText();
                setLoadingPost(true)
                await axios.post("http://localhost:5231/api/Contest/addContest", {
                    Name: name.trim(),
                    StartDate: startDate,
                    EndDate: endDate,
                    Description: descriptionText,
                    Price: price,
                    Status: status,
                    IdAccountPost: admin.idAccount
                })

                if (initialStatus !== status) {
                    let subject = `${name} Competition has already started`
                    let body = name + "\n\n" + descriptionText + "\nPrice: $" +
                        price + "\nFrom: " + formatDateText(startDate) + " To " + formatDateText(endDate)

                    await axios.post("http://localhost:5231/api/Contest/sendNewContest", {
                        To: "",
                        subject: subject,
                        Body: body
                    })
                }

                setLoadingPost(false)
                localStorage.setItem("managementTab", "contest");

                Swal.fire({
                    icon: 'success',
                    title: 'add contest successfully!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.reload();
                });;

                if (reloadContests) {
                    await reloadContests();
                }
                if (onClose) {
                    onClose();
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to add contest',
                    text: 'Please try again later.',
                });

            }
        } catch (er) { console.log(er) }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{
            maxWidth: "1000px", minWidth: "1000px", margin: "0 auto", padding: "10px", display: "flex",
            justifyContent: "center", gap: "20px"
        }}>
            <div style={{ width: "500px" }}>
                <div style={{ marginBottom: "45px", height: "50px", width: "95.9%" }}>
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

                <div style={{ marginBottom: "45px", height: "50px", width: "95.9%" }}>
                    <label htmlFor="price">Price ($):</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    {errors.price && <span style={{ color: "red" }}>{errors.price}</span>}
                </div>

                <div style={{ marginBottom: "45px", height: "50px", width: "95.9%" }}>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={formatDate(startDate)}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    {errors.startDate && <span style={{ color: "red" }}>{errors.startDate}</span>}
                </div>

                <div style={{ marginBottom: "45px", height: "50px", width: "95.9%" }}>
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={formatDate(endDate)}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    {errors.endDate && <span style={{ color: "red" }}>{errors.endDate}</span>}
                </div>

                <div style={{ marginBottom: "45px", height: "50px" }}>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    >
                        <option value="NOT YET">NOT YET</option>
                        <option value="HAPPENING">HAPPENING</option>
                    </select>
                    {errors.status && <span style={{ color: "red" }}>{errors.status}</span>}
                </div>
            </div>

            <div style={{
                marginBottom: "15px", display: "flex",
                justifyContent: "center", flexDirection: "column", gap: "20px"
            }}>
                <label htmlFor="description">Description: {errors.description && <span style={{ color: "red" }}>{errors.description}</span>}
                </label>
                <div style={{
                    border: "1px solid #ddd", height: "305px", padding: "10px", width: "500px"
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

export default AddContest;

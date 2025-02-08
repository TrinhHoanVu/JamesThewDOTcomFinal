import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import axios from "axios";
import Swal from 'sweetalert2';


function ContestEditForm({ idContest, onClose, reloadContests }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(() => EditorState.createEmpty());
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [initialStatus, setInitialStatus] = useState("");
    const [initialName, setInitialName] = useState("");
    const [initialDescription, setInitialDescription] = useState(() => EditorState.createEmpty());
    const [initialPrice, setInitialPrice] = useState(0);
    const [initialEndDate, setInitialEndDate] = useState("");
    const [contestNameList, setContestNameList] = useState([]);


    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingPost, setLoadingPost] = useState(false);

    const editorRef = useRef();

    const focus = () => {
        editorRef.current.focus();
    };

    const fetchContestNames = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getAllContestNames")
            setContestNameList(response.data.$values)
        } catch (err) { console.log(err) }
    }

    const fetchContest = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/detail/${idContest}`);
            const contest = response.data.contest;

            setName(contest.name);
            setPrice(contest.price);
            setStartDate(contest.startDate);
            setEndDate(contest.endDate);
            setStatus(contest.status);
            setInitialStatus(contest.status)

            setInitialName(contest.name);
            setInitialDescription(contest.description);
            setInitialPrice(contest.price);
            setInitialEndDate(contest.endDate);
            setInitialStatus(contest.status);

            if (contest.description) {
                const contentState = ContentState.createFromText(contest.description);
                setDescription(EditorState.createWithContent(contentState));
            }
            setLoading(false);
        } catch (err) {
            setError("Failed to load contest details.");
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        return parsedDate.toISOString().split('T')[0];
    };

    const formatDateText = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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
                await axios.put(`http://localhost:5231/api/Contest/update/${idContest}`, {
                    name,
                    description: descriptionText,
                    price,
                    startDate,
                    endDate,
                    status,
                });

                let subject;
                let body;

                if (initialStatus === "NOT YET" && status === "HAPPENING") {
                    subject = name + " is coming"
                    body = name + "\n" + descriptionText + "\n" + price + "\n" + formatDateText(startDate) + "\n" + formatDateText(endDate)
                    await axios.post("http://localhost:5231/api/Contest/sendNewContest", {
                        To: "",
                        subject: subject,
                        Body: body
                    })
                } else if (initialStatus === "HAPPENING" && status === "HAPPENING") {
                    subject = name + " has been updated"
                    body = name + "\n\n" + descriptionText + "\nPrice: $" + price + "\nFrom: " + formatDateText(startDate) + " To " + formatDateText(endDate)
                    await axios.post("http://localhost:5231/api/Contest/sendNewContest", {
                        To: "",
                        subject,
                        Body: body
                    });
                }

                setLoadingPost(false)
                Swal.fire({
                    icon: 'success',
                    title: 'Contest updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });


                if (reloadContests) {
                    await reloadContests();
                }
                if (onClose) {
                    onClose();
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to update contest',
                    text: 'Please try again later.',
                });

            }
        } catch (er) { console.log(er) }
    };

    useEffect(() => {
        try {
            fetchContest();
            fetchContestNames()
        } catch (err) { console.log(err) }
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

                <div style={{ marginBottom: "45px", height: "50px" }}>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={formatDate(startDate)}
                        onChange={status !== "HAPPENING" ? (e) => handleStartDateChange(e.target.value) : undefined}
                        readOnly={status === "HAPPENING"}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    {errors.startDate && <span style={{ color: "red" }}>{errors.startDate}</span>}
                </div>

                <div style={{ marginBottom: "45px", height: "50px" }}>
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
                        <option value="FINISHED">FINISHED</option>
                    </select>
                    {errors.status && <span style={{ color: "red" }}>{errors.status}</span>}
                </div>
            </div>

            <div style={{
                marginBottom: "15px", display: "flex",
                justifyContent: "center", flexDirection: "column", gap: "20px"
            }}>
                <label htmlFor="description">Description:</label>
                <div style={{
                    border: "1px solid #ddd",
                    height: "305px",
                    padding: "10px",
                    width: "500px",
                    overflow: "auto",
                    backgroundColor: "#fff"
                }}
                    onClick={focus}>
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
                {loadingPost && <div style={{ marginTop: "10px", color: "blue" }}>Saving contest, please wait...</div>}
            </div>
        </div>
    );
}

export default ContestEditForm;

import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DataContext } from "../../context/DatabaseContext";
import axios from "axios";
import "../../css/contest/contest-detail.css";
import NotFoundPage from '../notFoundPage.js';
import Swal from "sweetalert2";
import { AiFillLike } from "react-icons/ai";


function ContestDetail() {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [contest, setContest] = useState(null);
    const [description, setDescription] = useState("");
    const [winner, setWinner] = useState([]);
    const [entryList, setEntryList] = useState([]);
    const [likedComments, setLikedComments] = useState([]);
    const [userLogged, setUserLogged] = useState([]);
    const { tokenInfor } = useContext(DataContext);


    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (id) {
            fetchContest();
            fetchAttendeesList()
            fetchUser()
        } else {
            console.error("Invalid contest ID.");
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Account/${tokenInfor.email}`)
            if (response) {
                setUserLogged(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAttendeesList = async (contestId) => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/getRecipesWithAccount/${id}`);

            if (response.data) {
                setEntryList(response.data.$values || []);
            }
        } catch (err) {
            console.error("Error fetching attendees list:", err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to load entries. Please try again."
            });
        }
    };

    const fetchContest = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getSpecificContest", { params: { idContest: id } });
            setContest(response.data);
            setDescription(response.data.description);
        } catch (err) {
            console.log("not found contest")
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    const renderDescription = (description) => {
        try {
            if (typeof description === 'string') {
                return description.toString().split("\\n").map((item, key) =>
                    <span key={key}>{item}<br /></span>
                );
            } else {
                console.error("Invalid description type.");
                return "";
            }
        } catch (err) { console.log(err) }
    };

    const handleToggleExpand = (index) => {
        const link = location.pathname
        navigate(`${link}/entries/${index}`)
    };

    const getShortDescription = (description) => {
        return description && description.length > 200 ? `${description.slice(0, 200)}...` : description;
    };


    const handleLike = async (recipeId) => {
        console.log(userLogged.idAccount)
        try {
            const response = await axios.post("http://localhost:5231/api/Contest/likeRecipe", {
                RecipeId: recipeId,
                AccountId: userLogged.idAccount
            });

            setEntryList(entryList.map(entry =>
                entry.idRecipe === recipeId
                    ? { ...entry, likes: response.data.likes } 
                    : entry
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    return (
        <div className="contestdt-container">
            {contest ? (
                <div>
                    <div className="contestdt-details">
                        <img src={contest.image} alt={contest.name} className="contestdt-image" />
                        <h1 className="contestdt-title">{contest.name}</h1>
                        <div className="contestdt-info" >
                            <p className="contestdt-description">{renderDescription(description)}</p>
                            <p className='contestdt-price'>
                                <span style={{
                                    fontSize: "40px"
                                }}>
                                    Price: ${contest.price} {contest.winner && (<span> - Winner: {contest.winner.name}</span>)}
                                    <br />
                                    <strong style={{
                                        fontSize: "30px"
                                    }}>
                                        From: {formatDate(contest.startDate)} To {formatDate(contest.endDate)}
                                    </strong>
                                </span></p>
                            <p className="contestdt-duration">
                            </p>
                        </div>
                    </div>
                    <div className="cmtForm-container" style={{ width: "1000px", margin: "0 auto" }}>
                        <h3 className="cmtForm-header" style={{ fontSize: "45px" }}>Participants' Entries</h3>
                        <br /><br />
                        <div className="entries-list" style={{ display: 'flex', flexDirection: "column", width: "1000px" }}>
                            {entryList.map((entry, index) => (
                                <div key={entry.idRecipe} className="entry-item">
                                    <h4>{entry.account.name}'s entry</h4>
                                    <div style={{ display: "inline" }}>
                                        {getShortDescription(entry.description)}{" "}
                                        <button
                                            onClick={() => handleToggleExpand(entry.idRecipe)}
                                            style={{ border: "none", background: "none", color: "blue", cursor: "pointer", fontSize: "16px" }}
                                        >
                                            See More
                                        </button>
                                        <div style={{ paddingTop: "7px" }}>
                                            <span
                                                style={{
                                                    fontSize: "20px",
                                                    cursor: "pointer",
                                                    // color: isLiked ? 'black' : 'gray',
                                                }}
                                                onClick={contest.status !== "FINISHED" ? () => handleLike(entry.idRecipe) : null}
                                            >
                                                <AiFillLike />
                                            </span>
                                            <span style={{ fontSize: "13px", paddingBottom: "5px" }}> {entry.likes}</span>
                                        </div>
                                    </div>
                                    <br /><br />
                                </div>
                            ))}

                        </div>
                    </div>
                    <br /><br /><br /><br />

                    {/* <CommentForm contestId={id} contest={contest} /> */}
                </div>
            ) : <NotFoundPage />}

        </div>
    );
}

export default ContestDetail;
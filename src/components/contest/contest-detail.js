import React, { useEffect, useState } from 'react';
import CommentForm from "./commentForm.js";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../css/contest/contest-detail.css";
import NotFoundPage from '../notFoundPage.js';

function ContestDetail() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [description, setDescription] = useState("");
    const [winner, setWinner] = useState([]);

    useEffect(() => {
        if (id) {
            fetchContest();
        } else {
            console.error("Invalid contest ID.");
        }
    }, [id]);

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

    return (
        <div className="contestdt-container">
            {contest ? (
                <div>
                    <div className="contestdt-details">
                        <img src={contest.image} alt={contest.name} className="contestdt-image" />
                        <h1 className="contestdt-title">{contest.name}</h1>
                        <div className="contestdt-info">
                            <p className="contestdt-description">{renderDescription(description)}</p>
                            <p className='contestdt-price'>
                                <span style={{ fontSize: "40px" }}>
                                    Price: ${contest.price} {contest.winner && (<span> - Winner: {contest.winner.name}</span>)}
                                    <br />
                                    <strong style={{ fontSize: "30px" }}>
                                        From: {formatDate(contest.startDate)} To {formatDate(contest.endDate)}
                                    </strong>
                                </span></p>
                            <p className="contestdt-duration">
                            </p>
                        </div>
                    </div>
                    <CommentForm contestId={id} contest={contest} />
                </div>
            ) : <NotFoundPage />}

        </div>
    );
}

export default ContestDetail;
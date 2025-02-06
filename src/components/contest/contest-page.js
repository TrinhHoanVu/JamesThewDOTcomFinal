import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/contest/contest-page.css";

const ContestPage = () => {
    const [contests, setContests] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchContests();
    }, [pageNumber]);

    const fetchContests = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/getAll`, {
                params: { pageNumber, pageSize }
            });
            setContests(response.data.data.$values);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Error fetching contests:", error);
        }
    };

    const handleViewDetails = (contestId) => {
        navigate(`/contest/${contestId}`);
    };

    const handleNextPage = () => {
        if ((pageNumber - 1) * pageSize + contests.length < total) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    return (
        <div style={{ maxHeight: "700px", width: "100%" }}>
            <div>
                <img src="/images/contestbanner.jpg" alt="" className="contestdt-image" />
                <h1 className="contest-title">Contest Competition</h1>
            </div>
            <div className="contest-container">
                <div className="contest-list">
                    {contests.length > 0 ? (
                        contests.map((contest) => (
                            <ContestCard key={contest.idContest} contest={contest} onViewDetails={handleViewDetails} />
                        ))
                    ) : (
                        <p>No contests available.</p>
                    )}
                </div>

                {total > pageSize && (
                    <div className="contest-pagination">
                        <button className="contest-pagination-button" onClick={handlePreviousPage} disabled={pageNumber === 1}>
                            Previous
                        </button>
                        <span className="contest-pagination-text">
                            Page {pageNumber} of {Math.ceil(total / pageSize)}
                        </span>
                        <button
                            className="contest-pagination-button"
                            onClick={handleNextPage}
                            disabled={(pageNumber - 1) * pageSize + contests.length >= total}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ContestCard = ({ contest, onViewDetails }) => {
    try {
        const navigate = useNavigate();
        const maxLength = 100;

        const handleReadMore = () => {
            navigate(`/contest/${contest.idContest}`);
        };

        return (
            <div className="contest-card" onClick={() => handleReadMore()}>
                <h3 className="contest-card-title">{contest.name}</h3>
                <p className="contest-card-description">
                    {contest.description.length > maxLength
                        ? `${contest.description.substring(0, maxLength)}...`
                        : contest.description}
                    {contest.description.length > maxLength && (
                        <span className="contest-card-readmore" onClick={handleReadMore}>
                            More Detail
                        </span>
                    )}
                </p>
                <span className={`contest-status contest-status-${contest.status.toLowerCase()}`}>
                    {contest.status}
                </span>
            </div>
        );
    } catch (err) { console.log(err) }
};

export default ContestPage;

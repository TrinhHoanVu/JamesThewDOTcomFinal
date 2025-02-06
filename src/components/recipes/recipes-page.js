import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/tip/tip-page.css";
import { FaTimes } from "react-icons/fa";
import { DataContext } from "../../context/DatabaseContext";
import Swal from 'sweetalert2';
import AddTip from "../tips/add-tip";

const RecipesPage = () => {
    const [tips, setTips] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const navigate = useNavigate();
    const { tokenInfor } = useContext(DataContext);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const [addTipTable, setAddTipTable] = useState(false);

    useEffect(() => {
        try {
            fetchTips();
        } catch (err) { console.log(err) }

    }, [pageNumber]);

    const fetchTips = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Tips/getApprovedTips`, {
                params: { pageNumber, pageSize }
            });
            setTips(response.data.data.$values);
            setTotal(response.data.total);
            console.log(tips)
        } catch (error) {
            console.error("Error fetching tips:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Account/${tokenInfor.email}`);
            if (response) {
                setUser(response.data);
            }
        } catch (error) {
            console.log(error);
            showLoginAlert();
        }
    };

    const showLoginAlert = () => {
        Swal.fire({
            title: "You are not logged in",
            text: "You need to log in to view this content.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/login", { state: { from: location.pathname } });
            }
        });
    };

    const createOwnTip = () => {
        try {
            fetchUser()
            if (user)
                setAddTipTable(true)
        } catch (err) { console.log(err) }
    }

    const handleViewDetails = (tipId) => {
        try {
            navigate(`/tips/${tipId}`);
        } catch (er) { console.log(er) }
    };

    const handleNextPage = () => {
        try {
            if ((pageNumber - 1) * pageSize + tips.length < total) {
                setPageNumber(pageNumber + 1);
            }
        } catch (er) { console.log(er) }
    };

    const handlePreviousPage = () => {
        try {
            if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
            }
        } catch (er) { console.log(er) }

    };

    const filteredTips = tips.filter((tip) =>
        tip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tip.decription && tip.decription.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleClearSearch = () => {
        setSearchQuery("")
    }

    return (
        <div style={{ maxHeight: "700px", width: "100%" }}>
            <div>
                <img src="/images/contestbanner.jpg" alt="" className="contestdt-image" />
                <h1 className="tip-title"> COOKING TIPS</h1>
            </div>
            <div className="contest-container">
                <div style={{ width: "500px", margin: "0 auto" }}>
                    <div style={{
                        display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "500px"
                    }}>
                        <button className="compare-button-2" onClick={() => createOwnTip()}>
                            Create Your Own Tips
                        </button>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="Search tips..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{ width: "200px", height: "40px" }}
                            />
                            {searchQuery && <FaTimes
                                style={{ fontSize: "25px", cursor: "pointer", borderRadius: "50%", border: "1px black" }}
                                onClick={() => handleClearSearch()} />}
                        </div>
                    </div>
                </div>
                <br /><br />
                <div className="contest-list">
                    {filteredTips.length > 0 ? (
                        filteredTips.map((tip, index) => (
                            <TipCard key={tip.idTip || `tip-${index}`} tip={tip} onViewDetails={handleViewDetails} />
                        ))
                    ) : (
                        <p>No Tips available.</p>
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
                            disabled={(pageNumber - 1) * pageSize + tips.length >= total}
                        >
                            Next
                        </button>
                    </div>
                )}
                {addTipTable && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <AddTip onClose={() => setAddTipTable(false)} IsApproved={false} title="Add tip successfully! Please wait for approving!" />
                            <button className="close-modal-button" onClick={() => setAddTipTable(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TipCard = ({ tip, onViewDetails }) => {
    try {
        const navigate = useNavigate();
        const maxLength = 100;

        const handleReadMore = () => {
            navigate(`/tips/${tip.idTip}`);
        };
        return (
            <div className="contest-card" onClick={() => handleReadMore()}>
                <h3 className="contest-card-title">{tip.name}</h3>
                <p className="contest-card-description">
                    {tip.decription.length > maxLength
                        ? `${tip.decription.substring(0, maxLength)}...`
                        : tip.decription}
                    {tip.decription.length > maxLength && (
                        <span className="contest-card-readmore" onClick={handleReadMore}>
                            More Detail
                        </span>
                    )}
                </p>
                <span className={`contest-status contest-status-public`}>
                    {tip.isPublic ? "Public" : "Private"}
                </span>
            </div>
        );
    } catch (err) { console.log(err) }
};

export default RecipesPage;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContestEditForm from "./contest-edit";
import $ from "jquery";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import "datatables.net";
import "../../css/management/contest-magenement.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import AddContest from "../contest/add-contest";

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
        const elementsToObserve = document.querySelectorAll('.contest-management-container'); // Adjust the selector

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

function ContestManagement() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendeesCount, setAttendeesCount] = useState({});
    const [contestEdit, setContestEdit] = useState(false);
    const [addContest, setAddContest] = useState(false);
    const [idContest, setIdContest] = useState(0);
    const navigate = useNavigate()

    useThrottledResizeObserver(() => {
        if (contests.length > 0) {
            setTimeout(() => {
                $("#contestTable").DataTable();
            }, 500);
        }
    });

    const fetchContests = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getAll");
            let contestData = response.data.data.$values || [];

            const objectMap = {};

            contestData.forEach((contest) => {
                if (contest.winner) {
                    objectMap[contest.winner.$id] = contest.winner;
                }
            });

            contestData = contestData.map((contest) => {
                if (contest.winner && contest.winner.$ref) {
                    contest.winner = objectMap[contest.winner.$ref] || null;
                }
                return contest;
            });

            setContests(contestData);
            setLoading(false);
        } catch (err) {
            setError("Failed to load contests. Please try again.");
            setLoading(false);
        }
    };

    const fetchAttendeesCount = async (contestId) => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getAttendeesOfContest", {
                params: { idContest: contestId }
            });

            if (response.data) {
                setAttendeesCount((prevState) => ({
                    ...prevState,
                    [contestId]: response.data.attendeesCount
                }));
            }
        } catch (err) {
            console.error("Error fetching attendees count:", err);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    useEffect(() => {
        contests.forEach((contest) => {
            fetchAttendeesCount(contest.idContest);
        });
    }, [contests]);
    useEffect(() => {
        try {
            if (contests.length > 0) {
                setTimeout(() => {
                    $("#contestTable").DataTable({
                        destroy: true,
                        pageLength: 5,
                        lengthMenu: [5, 10],
                    });
                }, 500);
            }
        } catch (err) {
            console.log(err);
        }
    }, [contests]);

    const handleEdit = (contestId, status) => {
        try {
            const statusContest = ["NOT YET", "HAPPENING"];
            if (statusContest.includes(status.toUpperCase())) {
                setIdContest(contestId);
                setContestEdit(true);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contest already started',
                    text: 'You cannot edit a contest that has already started.',
                });
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleDelete = async (contestId, status, name) => {
        try {
            if (status.toUpperCase() === "NOT YET") {
                Swal.fire({
                    title: `Delete ${name}?`,
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`http://localhost:5231/api/Contest/delete/${contestId}`);
                            localStorage.setItem("managementTab", "contest");
                            Swal.fire('Deleted!', 'The contest has been deleted.', 'success').then(() => {
                                window.location.reload();
                            });
                        } catch (err) {
                            Swal.fire('Error!', 'Failed to delete the contest. Please try again.', 'error');
                        }
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Contest has already started',
                    text: 'You cannot delete a contest that has already started.',
                });
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleAttendeesDetail = (contestId) => {
        navigate(`/contest/attendees/${contestId}`)
    };

    const navigateToEvaluation = (contestId) => {
        navigate(`/contest/evaluation/${contestId}`)
    }

    const navigateToSpecificContestPage = (contestId) => {
        navigate(`/contest/${contestId}`)
    }

    const reloadContests = async () => {
        try {
            await fetchContests();
        } catch (er) { console.log(er) }
    };

    const handleAddContest = () => {
        setAddContest(true)
    }

    return (
        <div className="contest-management-body">
            <h1 className="contest-management-title">Contest Management</h1>
            <div className="contest-management-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="contest-management-error-message">{error}</p>
                ) : (
                    <table id="contestTable" className="display" style={{ backgroundColor: "transparent" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price ($)</th>
                                <th>Attendees</th>
                                <th>Status</th>
                                <th>Winner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((contest) => (
                                <tr key={contest.idContest}>
                                    <td style={{ cursor: "pointer" }} onClick={() => navigateToSpecificContestPage(contest.idContest)}>
                                        {contest.name}
                                    </td>
                                    <td className="price" style={{ textAlign: "right" }}>
                                        {contest.price !== null && contest.price !== undefined ? contest.price.toFixed(2) : "N/A"}
                                    </td>
                                    <td style={{ cursor: "pointer", textAlign: "right" }} onClick={() => handleAttendeesDetail(contest.idContest)}>
                                        <span>{attendeesCount[contest.idContest] || 0}</span>
                                    </td>
                                    <td className={`status ${contest.status ? "active" : "inactive"}`} style={{ textAlign: "right" }}>
                                        {contest.status}
                                    </td>
                                    <td style={{ cursor: "pointer", textAlign: "right" }}> {contest.winner ? (<span>{contest.winner.name}</span>) :
                                        (<span onClick={() => navigateToEvaluation(contest.idContest)}>
                                            No Winner
                                        </span>)}
                                    </td>
                                    <td className="actions">
                                        {contest.status.toUpperCase() !== "FINISHED" ? (
                                            <>
                                                <FaEdit
                                                    className="contest-action-icon edit-icon"
                                                    onClick={() => handleEdit(contest.idContest, contest.status)}
                                                    title="Edit"
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <FaTrash
                                                    className="contest-action-icon delete-icon"
                                                    onClick={() => handleDelete(contest.idContest, contest.status, contest.name)}
                                                    title="Delete"
                                                    style={{ cursor: "pointer", marginLeft: "20px" }}
                                                />
                                            </>
                                        ) : (
                                            <span className="no-action">Finished</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <button className="compare-button" onClick={() => handleAddContest()}><FaPlus /> Add</button>

            </div>
            {contestEdit && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <ContestEditForm idContest={idContest} onClose={() => setContestEdit(false)} reloadContests={reloadContests} />
                        <button className="close-modal-button" onClick={() => setContestEdit(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            {addContest && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <AddContest onClose={() => setAddContest(false)} reloadContests={reloadContests} />
                        <button className="close-modal-button" onClick={() => setAddContest(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContestManagement;

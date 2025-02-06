import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import $ from "jquery";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import "datatables.net";
import "../../css/contest/attendees-detail.css";
import { FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";

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
        const elementsToObserve = document.querySelectorAll('.attendees-modal-overlay');

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

function Approval() {
    const { contestId } = useParams();
    const [attendeesList, setAttendeesList] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const compareTableRef = useRef(null)
    const [tableCompare, setTableCompare] = useState(false);
    const [checkedState, setCheckedState] = useState();
    const [contest, setContest] = useState({});

    useEffect(() => {
        try {
            if (attendeesList.length > 0) {
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
    }, [attendeesList]);

    useThrottledResizeObserver(() => {
        if (attendeesList.length > 0) {
            $(tableRef.current).DataTable();
        }
    });

    useEffect(() => {
        if (contestId) {
            fetchAttendeesList(contestId);
            fetchContest()
        }
    }, [contestId]);

    useEffect(() => {
        setCheckedState(new Array(attendeesList.length).fill(false));
    }, [attendeesList]);

    const fetchContest = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getSpecificContest", { params: { idContest: contestId } });
            setContest(response.data);
        } catch (err) {
            console.log("not found contest")
        }
    };

    const fetchAttendeesList = async (contestId) => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/getTopComments`, {
                params: { contestId: contestId }
            });

            if (response.data) {
                setAttendeesList(response.data.$values || []);
            }
        } catch (err) {
            console.error("Error fetching attendees list:", err);
            Swal.fire("Error", "Failed to load attendees. Please try again.", "error");
        }
    };

    const addCommentsToCompare = (index) => {

        setCheckedState((prevState) => {
            const updatedState = [...prevState];
            updatedState[index] = !prevState[index];
            return updatedState;
        });

        setSelectedComments((prevSelectedComments) => {
            let updatedComments;

            try {
                const isCommentSelected = prevSelectedComments.some(comment => comment.content === attendeesList[index].content);

                if (isCommentSelected) {
                    updatedComments = prevSelectedComments.filter(comment => comment.content !== attendeesList[index].content);
                } else {
                    updatedComments = [...prevSelectedComments, attendeesList[index]];
                    if (updatedComments.length > 3) updatedComments = updatedComments.slice(1);
                }

                if (updatedComments.length === 0) {
                    setTableCompare(false);
                }
            } catch (err) {
                console.log(err)
            }

            return updatedComments;
        });
    };

    const handleClear = () => {
        setTableCompare(false);
        setCheckedState([])
        setSelectedComments([]);
    }

    const handleApprove = async () => {
        try {
            const markedAttendees = attendeesList.filter(attendee => attendee.mark && attendee.mark > 0);
            if (markedAttendees.length === 0) {
                Swal.fire("Warning", "No marked comments to save.", "warning");
                return;
            }
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to save all the changes?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, save them!',
                cancelButtonText: 'No, cancel'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const promises = markedAttendees.map(attendee =>
                        axios.put(`http://localhost:5231/api/Contest/updateMark/${attendee.idComment}`, {
                            mark: attendee.mark
                        })
                    );

                    await Promise.all(promises);

                    Swal.fire("Success", "Marks have been saved successfully!", "success");
                }
            });
        } catch (error) {
            console.error("Error saving marks:", error);
            Swal.fire("Error", "Failed to save marks. Please try again.", "error");
        }
    };

    return (
        <div className="attendees-modal-overlay">
            <div className="attendees-modal">
                <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", height: "30px" }}>
                    <div style={{ textAlign: "center", width: "97%" }}>
                        <h2>Recipe Approval</h2>
                    </div>
                    <button style={{
                        height: "20px", width: "3%", cursor: "pointer",
                        background: "none", border: "none", fontSize: "15px"
                    }}
                        onClick={() =>
                            navigate("/management", {
                                state: { isProfile: false, isContest: false, isRecipe: true, isTip: false }
                            })
                        }>Back</button>
                </div>
                <table ref={tableRef} id="contestTable" className="display">
                    <thead>
                        <tr>
                            <th className="select-column"></th>
                            <th className="name-column">Name</th>
                            <th className="comment-column">Comment</th>
                            <th className="likes-column">Likes</th>
                            <th className="evaluate-column">Mark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendeesList.length > 0 ? (
                            attendeesList.map((attendee, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: "center" }} onClick={() => addCommentsToCompare(index)}>
                                        {checkedState[index] ? <FaCheck /> : <div></div>}
                                    </td>
                                    <td>{attendee.account.name}</td>
                                    <td>{attendee.content}</td>
                                    <td style={{ textAlign: "left" }}>{attendee.likes}</td>
                                    <td>
                                        <input type="number"
                                            className="evaluate-input"
                                            min="1"
                                            max="10"
                                            defaultValue={attendee.mark}
                                            onInput={(e) => {
                                                if (e.target.value < 1) e.target.value = 1;
                                                if (e.target.value > 10) e.target.value = 10;
                                            }}
                                            disabled={!!contest.winner}
                                            onChange={(e) => { attendee.mark = e.target.value }} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No recipe found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {!contest.winner ? (<div style={{ display: "flex", justifyContent: "start", flexDirection: "row", gap: "10px" }}>
                    <button className="compare-button" onClick={handleClear}>
                        Clear
                    </button>
                    <button className="compare-button" onClick={handleApprove}>
                        Approve
                    </button>
                </div>) : (<span></span>)}
                <br /><br /><br />
            </div>
        </div >
    );
}

export default Approval
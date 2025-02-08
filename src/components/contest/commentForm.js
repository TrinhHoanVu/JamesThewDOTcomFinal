import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { DataContext } from "../../context/DatabaseContext";
import PaymentForm from '../account/payment-form';
import "../../css/contest/commentForm.css"
import { AiFillLike } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";



const CommentForm = ({ contestId, contest }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const { tokenInfor } = useContext(DataContext);
    const [roleUser, setRoleUser] = useState(tokenInfor);
    const [userLogged, setUserLogged] = useState([]);
    const [commented, setCommented] = useState(false);
    const [loggedAccountComment, setLoggedAccountComment] = useState([]);
    const [buttonComment, setButtonComment] = useState("Edit comment");
    const [likedComments, setLikedComments] = useState([]);
    const [statusUser, setStatusUser] = useState(false);
    const [isFetchingLastestComments, setIsFetchingLastestComments] = useState(false);
    const [isNewComment, setIsNewComment] = useState(false);
    const [editedComment, setEditedComment] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchTopComments();
        if (userLogged.idAccount) {
            fetchUserCommented();
            fetchLikedComments();
        }
    }, [userLogged, isFetchingLastestComments]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Account/${tokenInfor.email}`)
            if (response) {
                setUserLogged(response.data)
                setStatusUser(response.data.status)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserCommented = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/checkCommented`, {
                params: {
                    contestId: contestId, accountId: userLogged.idAccount
                }
            });

            setCommented(response.data.commented)
            if (response.data.commented) {
                fetchUserComment();
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    const fetchTopComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/getTopComments`, {
                params: { contestId: contestId }
            });
            if (response.data && Array.isArray(response.data.$values)) {
                setComments(response.data.$values);
            } else {
                console.error("Unexpected response format");
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchLastestComments = async () => {
        try {
            setIsFetchingLastestComments(true);
            const response = await axios.get(`http://localhost:5231/api/Contest/getLastestComments`, {
                params: { contestId: contestId }
            });
            if (response.data && Array.isArray(response.data.$values)) {
                setComments(response.data.$values);
            } else {
                console.error("Unexpected response format");
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post('http://localhost:5231/api/Contest/postComment', {
                content: newComment,
                contestId,
                userId: userLogged.idAccount,
            });

            const newPostedComment = {
                idComment: response.data.idComment,
                content: newComment,
                likes: 0,
                postedDate: new Date().toISOString(),
                account: userLogged,
            };

            setLoggedAccountComment(newPostedComment);
            setNewComment('');
            setCommented(true);
            setComments([newPostedComment, ...comments]);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleSetDefaultComment = () => {
        setNewComment('');
    }

    const handleLike = async (commentId) => {
        try {
            const response = await axios.post("http://localhost:5231/api/Contest/like", {
                CommentId: commentId,
                AccountId: userLogged.idAccount
            });

            setComments(comments.map(comment =>
                comment.idComment === commentId
                    ? { ...comment, likes: response.data.likes, likedByUser: response.data.liked }
                    : comment
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const renderComments = (commentList) => {
        try {
            return commentList
                .filter(comment => comment.account.idAccount !== userLogged.idAccount)
                .map(comment => {
                    const formattedDate = new Date(comment.postedDate).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    const isLiked = likedComments.some(liked => liked.idComment === comment.idComment);

                    return (
                        <div key={comment.idComment} className="cmtForm-box" style={{ marginTop: "20px", width: "1000px" }}>
                            <span className="cmtForm-content">
                                <strong style={{ fontSize: "13px", paddingBottom: "10px" }}>
                                    @{comment.account.name}
                                    <span style={{ fontSize: "12px", color: "gray", marginLeft: "10px" }}>
                                        {formattedDate}
                                    </span>
                                </strong>
                                <br />
                                <span style={{ paddingTop: "13px" }}>{comment.content}</span>
                            </span>
                            <br />
                            <div style={{ paddingTop: "7px" }}>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        color: isLiked ? 'black' : 'gray',
                                    }}
                                    onClick={contest.status !== "FINISHED" ? () => handleLike(comment.idComment) : null}
                                >
                                    <AiFillLike />
                                </span>
                                <span style={{ fontSize: "13px", paddingBottom: "5px" }}> {comment.likes}</span>
                            </div>
                        </div>
                    );
                });
        } catch (err) {
            console.log(err)
        }
    };

    const fetchUserComment = async () => {
        try {
            const response = await axios.get(`http://localhost:5231/api/Contest/getComment`, {
                params: { contestId: contestId, accountId: userLogged.idAccount }
            });
            if (response.data) {
                setLoggedAccountComment(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCommentClick = () => {
        try {
            if (!roleUser) {
                Swal.fire({
                    icon: "warning",
                    title: "Authentication Required",
                    text: "Please log in to comment.",
                    showCancelButton: true,
                    confirmButtonText: "Log in",
                    cancelButtonText: "Cancel"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login", { state: { from: window.location.pathname } });
                    }
                });
                return;
            }

            if (!statusUser) {
                setShowPaymentForm(true);
            } else {
                setShowPaymentForm(false);
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleClosePaymentForm = () => {
        setShowPaymentForm(false);
    };

    const handleDeleteComment = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5231/api/Contest/deleteComment/${loggedAccountComment.idComment}`);
            setCommented(false);
            setLoggedAccountComment([]);
            setComments(comments.filter(comment => comment.idComment !== loggedAccountComment.idComment));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

    const handleEditComment = () => {
        try {
            if (buttonComment === "Edit comment") {
                setIsNewComment(true);
                setButtonComment("Save comment");

                if (editedComment.trim() === "") {
                    setEditedComment(loggedAccountComment.content);
                }

            }
            else {
                setIsNewComment(false);
                setButtonComment("Edit comment");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchLikedComments = async () => {
        try {
            const response = await axios.get("http://localhost:5231/api/Contest/getLikedComments", {
                params: { idAccount: userLogged.idAccount }
            });
            if (response.data) {
                setLikedComments(response.data.$values)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="cmtForm-container">
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "start", gap: "20px" }}>
                <h3 className="cmtForm-header">Comments</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "start", gap: "5px" }}>
                    <h5 style={{ cursor: "pointer" }} onClick={fetchTopComments}>Top comments</h5>
                    <h5 style={{ cursor: "pointer" }} onClick={fetchLastestComments}>Lastest comments</h5>
                </div>
            </div>
            {(contest.status !== "FINISHED" && contest.status !== "NOT YET") ? (
                !commented ? (
                    <div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <textarea
                                className="cmtForm-input"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                onClick={handleCommentClick}
                                readOnly={!statusUser}
                            />
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", width: "1000px" }}>
                                {newComment && <span className='cmtForm-cancel-button' onClick={handleSetDefaultComment}>Cancel</span>}
                                {newComment && <button className="cmtForm-submit-button" onClick={handleSubmit}>Submit</button>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: "20px", width: "1000px" }}>
                        <strong>Your comment</strong> <br />
                        {isNewComment ? <textarea
                            name="editcomment"
                            id="editcomment"
                            style={{ border: "none", borderBottom: "1px solid black", width: "1000px", height: "100px" }}
                            value={loggedAccountComment.content}
                            onChange={(e) => setEditedComment(e.target.value)}
                        /> : loggedAccountComment.content}

                        <br />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "10px" }}>
                            <div style={{ textAlign: "left" }}>
                                <span style={{ fontSize: "20px" }}><AiFillLike /></span>
                                <span style={{ fontSize: "13px", paddingBottom: "5px" }}>{loggedAccountComment.likes}</span>
                            </div>
                            <div style={{ textAlign: "right", display: "flex", flexDirection: "row", gap: "10px" }}>
                                <span className="cmtForm-submit-button" onClick={handleDeleteComment}>Delete</span>
                                {!loggedAccountComment.isApproved &&
                                    <span className="cmtForm-submit-button" onClick={handleEditComment}>{buttonComment}</span>}
                            </div>
                        </div>
                        <hr />
                    </div>
                )
            ) : (
                <div style={{ marginTop: "20px", fontSize: "16px", fontWeight: "bold", color: "red" }}>
                    {contest.status == "FINISHED" ? (<span>Comments are disabled as the contest has finished.</span>)
                        : (<span>Comments are disabled as the contest has not already started.</span>)}
                </div>
            )}

            <div className="cmtForm-list">{renderComments(comments)}</div>
            {showPaymentForm && !statusUser && (
                <div className="cmtForm-overlay">
                    <div className="cmtForm-payment-box">
                        <button className="cmtForm-close-button" onClick={handleClosePaymentForm}>✖</button>
                        <h4 className="cmtForm-message">Your account is not active. Please subcribe to comment.</h4>
                        <PaymentForm user={userLogged} />
                    </div>
                </div>
            )}
        </div >
    );
};


export default CommentForm;
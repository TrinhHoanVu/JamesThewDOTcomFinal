import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

var id="";
const Recipe = () => {
    const [item, setItem] = useState(null);
    const [comments, setComments] = useState([
        { text: "This recipe looks amazing! Can't wait to try it.", rating: 5, username: "John Doe" }
    ]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);
    const { recipeId } = useParams();
    const { tokenInfor, user } = useContext(AuthContext); // Lấy trạng thái đăng nhập
    const navigate = useNavigate(); // Điều hướng trang

    // Fetch dữ liệu công thức nấu ăn
    useEffect(() => {
        if (recipeId) {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
                .then(res => res.json())
                .then(data => setItem(data.meals ? data.meals[0] : null));
        }
    }, [recipeId]);

    const addComment = (e) => {
        e.preventDefault();

        if (!tokenInfor) {
            alert("You need to log in to submit a price!!");
            navigate("/login"); // Chuyển hướng đến trang đăng nhập
            return;
        }

        if (newComment && newRating) {
            setComments([...comments, { text: newComment, rating: newRating, username: user.name }]);
            setNewComment("");
            setNewRating(0);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < rating ? "filled" : ""}`} onClick={() => setNewRating(i + 1)}>
                &#9733;
            </span>
        ));
    };
    return (
        <>
            {
                (!item) ? "" : <div className="content">
                    <img src={item.strMealThumb} alt="" />
                    <div className="inner-content">
                        <h1>{item.strMeal}</h1>
                        <h2>{item.strArea} Food</h2>
                        <h3>Category {item.strCategory}</h3>
                    </div>
                
                    <div className="recipe-details">
                        <div className="ingredients">
                            <h2>Ingredients</h2><br />
                            <h4>{item.strIngredient1}:{item.strMeasure1}</h4>
                            <h4>{item.strIngredient2}:{item.strMeasure2}</h4>
                            <h4>{item.strIngredient3}:{item.strMeasure3}</h4>
                            <h4>{item.strIngredient4}:{item.strMeasure4}</h4>
                            <h4>{item.strIngredient5}:{item.strMeasure5}</h4>
                            <h4>{item.strIngredient6}:{item.strMeasure6}</h4>
                            <h4>{item.strIngredient7}:{item.strMeasure7}</h4>
                            <h4>{item.strIngredient8}:{item.strMeasure8}</h4>
                        </div>
                        <div className="instructions">
                            <h2>Instructions</h2><br />
                            <h4>{item.strInstructions}</h4>
                        </div>
                    </div>
                    <div className="video">
                       
                            {/* setVurl(item.strYoutube)
                                //const str=item.strYoutube.split("=");
                                //state=str[str.length-1];
                                //state="hj"    */}
                       
                       
                        <iframe width="
                        100%" height="515" title="recipeVideo"
                            src={`https://www.youtube.com/embed/${id}`}>
                        </iframe>
                    </div>
                    <div className="review-section">
                        <h4>Leave a Review</h4>
                        <div className="rating">
                            {renderStars(newRating)}
                        </div>
                        <h5 className='fs-16 text-black'>User Reviews:</h5>
                        <textarea 
                            className="comment-box" 
                            placeholder="Write your comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="submit-btn" onClick={addComment}>Submit</button>

                        <div className="reviews">
                            <h5 className='fs-16 text-black'>Reviews:</h5>
                            {comments.map((comment, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-stars">
                                        {renderStars(comment.rating)}
                                    </div>
                                    <p><strong>{comment.username}</strong>: {comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }

        </>
    )
}
export default Recipe

// import { AuthContext } from "../context/AuthContext"; // Giả sử AuthContext lưu trạng thái đăng nhập
// var id="";
// const Recipe = () => {


//     return (
//         <>
        
//              (!item) ? "" : <div className="content">
//                      <img src={item.strMealThumb} alt="" />
//                      <div className="inner-content">
//                          <h1>{item.strMeal}</h1>
//                          <h2>{item.strArea} Food</h2>
//                          <h3>Category {item.strCategory}</h3>
//                      </div>
                
//                      <div className="recipe-details">
//                          <div className="ingredients">
//                              <h2>Ingredients</h2><br />
//                              <h4>{item.strIngredient1}:{item.strMeasure1}</h4>
//                              <h4>{item.strIngredient2}:{item.strMeasure2}</h4>
//                              <h4>{item.strIngredient3}:{item.strMeasure3}</h4>
//                              <h4>{item.strIngredient4}:{item.strMeasure4}</h4>
//                              <h4>{item.strIngredient5}:{item.strMeasure5}</h4>
//                              <h4>{item.strIngredient6}:{item.strMeasure6}</h4>
//                              <h4>{item.strIngredient7}:{item.strMeasure7}</h4>
//                              <h4>{item.strIngredient8}:{item.strMeasure8}</h4>
//                          </div>
//                          <div className="instructions">
//                              <h2>Instructions</h2><br />
//                              <h4>{item.strInstructions}</h4>
//                          </div>
//                      </div>
//                      <div className="video">
                       
//                              {/* setVurl(item.strYoutube)
//                                  //const str=item.strYoutube.split("=");
//                                  //state=str[str.length-1];
//                                  //state="hj"    */}
                       
//                          <iframe width="
//                          100%" height="515" title="recipeVideo"
//                              src={`https://www.youtube.com/embed/${id}`}>
//                          </iframe>
//                     </div>

//                     <div className="review-section">
//                         <h4>Leave a Review</h4>
//                         <div className="rating">{renderStars(newRating)}</div>
//                         <textarea
//                             className="comment-box"
//                             placeholder="Write your comment..."
//                             value={newComment}
//                             onChange={(e) => setNewComment(e.target.value)}
//                         />
//                         <button className="submit-btn" onClick={addComment}>Submit</button>

//                         <div className="reviews">
//                             <h5>Reviews:</h5>
//                             {comments.map((comment, index) => (
//                                 <div key={index} className="review-item">
//                                     <div className="review-stars">{renderStars(comment.rating)}</div>
//                                     <p><strong>{comment.username}</strong>: {comment.text}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//              : (
//                 <p>Loading...</p>
//             )
        
//         </>
//     );
// };

// export default Recipe;

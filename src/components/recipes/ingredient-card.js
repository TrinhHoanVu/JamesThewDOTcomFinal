import React from 'react'
import "../../css/recipe/ingredient-card.css"
import { FaTimes } from 'react-icons/fa';

function IngredientCard({ name, handleIngredientRemove }) {
    return (
        <div className='ingredient-card-container'>
            {name}
            <FaTimes style={{ fontSize: "13px", cursor: "pointer" }} onClick={() => handleIngredientRemove(name)} />
        </div>
    );
}


export default IngredientCard
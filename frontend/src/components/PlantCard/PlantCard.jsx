import React, { useState, useEffect } from 'react';
import './PlantCard.css';

const PlantCard = (props) => {
    const plant = props.plant;

    const [maxWidth, setMaxWidth] = useState(200);

    useEffect(() => {
            setMaxWidth(plant.width);
    }, []);

    function getThumbnail(plant) {
        const thumbnail = plant?.default_image?.thumbnail;

        if(!thumbnail) console.info(`Warning: The image for the ${plant.common_name} was not found.`);

        return thumbnail || 'https://placehold.co/200x200?text=This%20is%20a%20tree';
    }

    return (
        <div 
            className="plantCard" 
            key={plant.id} 
            onClick={props.onChildClick} 
            style={{maxWidth: `${maxWidth}px`}}
        >
            <img 
                className="plantCard-image" 
                src={getThumbnail(plant)} 
                alt="Plant thumbnail"
            />
            <div className="plantCard-info">
                <h5>{plant.common_name}</h5>
                <div>
                    <div className="plantCard-btn-container">
                        <button className="plantCard-add-button" aria-label="Add to Cart">+</button>
                        <span>Add to Cart</span>
                    </div>
                    <div className="plantCard-btn-container">
                        <button className="plantCard-add-button" aria-label="Add to Garden">+</button>
                        <span>Add to Garden</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlantCard;
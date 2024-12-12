import React from 'react'
import './PlantCard.css'

const PlantCard = (props) => {
    const plant = props.plant;

    function getImageThumbnail(plant) {
        try {
            const thumbnail = plant['default_image']['thumbnail'];
            if (thumbnail != null) return thumbnail;
            else return 'https://placehold.co/200x200?text=This%20is%20a%20tree';
        } catch (e) {
            console.log(`Error: `,e);
            console.log(JSON.stringify(plant));
            return 'https://placehold.co/200x200?text=This%20is%20a%20plant';
        }
    }

    return (
        <div className="plantCard" key={plant['id']} onClick={props.onChildClick} style={{cursor: 'Pointer'}}>
            <img src={getImageThumbnail(plant)}></img>
            <p>{plant['common_name']}</p>
        </div>
    )
}

export default PlantCard
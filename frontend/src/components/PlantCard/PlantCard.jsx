import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './PlantCard.css';

const PlantCard = (props) => {
    const plant = props.plant;
    const isAuthenticated = props.isAuthenticated;
    const dispatch = useDispatch();
    const inGarden = useSelector((state) => state.garden.has(plant.id));
    const [imageLoaded, setImageLoaded] = useState(false);

    function getThumbnail(plant) {
        const thumbnail = plant?.default_image?.thumbnail;
        return thumbnail || 'https://placehold.co/200x200?text=This%20is%20a%20tree';
    }

    function handleAddToGarden(e) {
        e.stopPropagation();
        if (!inGarden) {
            dispatch({ type: 'addToGarden', payload: { item: plant } });
        }
    }

    return (
        <div
            className="plantCard"
            key={plant.id}
            onClick={props.onChildClick}
        >
            <div className="plantCard-image-wrapper">
                {!imageLoaded && <div className="plantCard-image-skeleton" />}
                <img
                    className="plantCard-image"
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                    src={getThumbnail(plant)}
                    alt="Plant thumbnail"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/200x200?text=This+is+a+plant';
                        setImageLoaded(true);
                    }}
                />
                {isAuthenticated && imageLoaded && (
                    <button
                        className={`plantCard-garden-btn ${inGarden ? 'in-garden' : ''}`}
                        onClick={handleAddToGarden}
                        title="Add to Your Garden"
                        aria-label="Add to Your Garden"
                    >
                        {inGarden ? '✓' : '+'}
                    </button>
                )}
            </div>
            <div className="plantCard-info">
                <h5>{plant.common_name}</h5>
            </div>
        </div>
    );
};

export default PlantCard;

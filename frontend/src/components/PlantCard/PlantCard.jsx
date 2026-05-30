import { useState } from 'react';
import { toTitleCase } from '../../utils/stringUtils';
import { useGardenState } from '../../hooks/useGardenState';
import './PlantCard.css';

const PlantCard = (props) => {
    const plant = props.plant;
    const isAuthenticated = props.isAuthenticated;
    const { inGarden, addToGarden, removeFromGarden } = useGardenState(plant);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    function handleAdd(e) {
        addToGarden(e);
        setJustAdded(true);
    }

    function getThumbnail(plant) {
        const thumbnail = plant?.default_image?.thumbnail;
        return thumbnail || 'https://placehold.co/200x200?text=This%20is%20a%20tree';
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
                    inGarden ? (
                        <button
                            className={`plantCard-garden-btn in-garden${justAdded ? ' just-added' : ''}`}
                            onClick={removeFromGarden}
                            onMouseLeave={() => setJustAdded(false)}
                            title="Remove from Your Garden"
                            aria-label="Remove from Your Garden"
                        >
                            <span className="garden-btn-default">✓</span>
                            <span className="garden-btn-hovered">×</span>
                        </button>
                    ) : (
                        <button
                            className="plantCard-garden-btn"
                            onClick={handleAdd}
                            title="Add to Your Garden"
                            aria-label="Add to Your Garden"
                        >
                            +
                        </button>
                    )
                )}
            </div>
            <div className="plantCard-info">
                <h5>{toTitleCase(plant.common_name)}</h5>
            </div>
        </div>
    );
};

export default PlantCard;

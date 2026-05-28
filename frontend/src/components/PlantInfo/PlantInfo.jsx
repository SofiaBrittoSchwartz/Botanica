import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPlantById } from '../../services/plantService';

const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i;

function celsiusToFahrenheit(c) {
    return Math.round(c * 9 / 5 + 32);
}

const PlantInfo = () => {
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const garden = useSelector(state => state.garden);

    useEffect(() => {
        loadPlant();
    }, [id]);

    async function loadPlant() {
        setLoading(true);

        // Use router state immediately for a fast initial render
        const statePlant = location.state?.plant;
        if (statePlant) setPlant(statePlant);

        // Always fetch the full record from the API if the id is a MongoDB ObjectId
        if (MONGO_ID_PATTERN.test(id)) {
            const result = await getPlantById(id);
            if (result.success) setPlant(result.data);
        }

        setLoading(false);
    }

    if (loading && !plant) return <div className="container py-4">Loading...</div>;
    if (!plant) return <div className="container py-4 text-danger">Plant not found.</div>;

    const plantKey = plant._id || plant.id;
    const isInGarden = garden.has(plantKey);

    const thumbnail =
        plant.default_image?.thumbnail ||
        plant.default_image?.small_url ||
        'https://placehold.co/300x300?text=No+Image';

    const hasEnvData =
        plant.temperature?.min_celsius != null ||
        plant.humidity?.min_percent != null ||
        plant.light?.min_lux != null ||
        plant.ph?.min != null ||
        plant.soil_moisture?.min != null;

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-md-4 mb-3">
                    <img
                        src={thumbnail}
                        alt={plant.common_name}
                        className="img-fluid rounded"
                    />
                </div>
                <div className="col-md-8">
                    <h1>{plant.common_name}</h1>

                    {plant.scientific_name?.length > 0 && (
                        <p className="text-muted fst-italic">{plant.scientific_name.join(', ')}</p>
                    )}

                    {!isInGarden && (
                        <button
                            className="btn btn-success mb-4"
                            onClick={() => dispatch({ type: 'addToGarden', payload: { item: plant } })}
                        >
                            Add to My Garden
                        </button>
                    )}
                    {isInGarden && (
                        <p className="text-success mb-4">✓ Already in your garden</p>
                    )}

                    <h4>Care Information</h4>
                    <table className="table table-bordered">
                        <tbody>
                            {plant.cycle && <tr><th>Cycle</th><td>{plant.cycle}</td></tr>}
                            {plant.watering && <tr><th>Watering</th><td>{plant.watering}</td></tr>}
                            {plant.sunlight?.length > 0 && (
                                <tr><th>Sunlight</th><td>{plant.sunlight.join(', ')}</td></tr>
                            )}
                            {plant.difficulty && <tr><th>Difficulty</th><td>{plant.difficulty}</td></tr>}
                        </tbody>
                    </table>

                    {hasEnvData && (
                        <>
                            <h4>Environment Ranges</h4>
                            <table className="table table-bordered">
                                <tbody>
                                    {plant.temperature?.min_celsius != null && (
                                        <tr>
                                            <th>Temperature</th>
                                            <td>
                                                {celsiusToFahrenheit(plant.temperature.min_celsius)}°F – {celsiusToFahrenheit(plant.temperature.max_celsius)}°F
                                            </td>
                                        </tr>
                                    )}
                                    {plant.humidity?.min_percent != null && (
                                        <tr>
                                            <th>Humidity</th>
                                            <td>{plant.humidity.min_percent}% – {plant.humidity.max_percent}%</td>
                                        </tr>
                                    )}
                                    {plant.light?.min_lux != null && (
                                        <tr>
                                            <th>Light</th>
                                            <td>{plant.light.min_lux} – {plant.light.max_lux} lux</td>
                                        </tr>
                                    )}
                                    {plant.ph?.min != null && (
                                        <tr>
                                            <th>Soil pH</th>
                                            <td>{plant.ph.min} – {plant.ph.max}</td>
                                        </tr>
                                    )}
                                    {plant.soil_moisture?.min != null && (
                                        <tr>
                                            <th>Soil Moisture</th>
                                            <td>{plant.soil_moisture.min} – {plant.soil_moisture.max}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {plant.toxicity?.toxic_to_humans != null && (
                        <div className={`alert ${plant.toxicity.toxic_to_humans ? 'alert-danger' : 'alert-success'}`}>
                            {plant.toxicity.toxic_to_humans ? 'Toxic to humans and/or pets' : 'Non-toxic'}
                            {plant.toxicity.notes && ` — ${plant.toxicity.notes}`}
                        </div>
                    )}

                    {plant.description && (
                        <>
                            <h4>About</h4>
                            <p>{plant.description}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantInfo;

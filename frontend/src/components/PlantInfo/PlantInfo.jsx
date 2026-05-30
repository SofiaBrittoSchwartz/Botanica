import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGardenState } from '../../hooks/useGardenState';
import { getPlantById } from '../../services/plantService';
import { getCurrentUser } from '../../services/userService';
import { toTitleCase } from '../../utils/stringUtils';
import { LeafIcon, WaterIcon, SunIcon, ThermometerIcon } from '../../assets/icons';
import './PlantInfo.css';

const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i;

function celsiusToFahrenheit(c) {
    return Math.round(c * 9 / 5 + 32);
}

const MOCK_WATERING_HISTORY = [
    { date: 'May 20, 2025', type: 'Watered', notes: 'Top inch of soil was dry' },
    { date: 'May 13, 2025', type: 'Watered', notes: 'Watered thoroughly' },
    { date: 'May 6, 2025', type: 'Watered', notes: 'Leaves looking great' },
    { date: 'Apr 29, 2025', type: 'Watered', notes: 'Soil was very dry' },
    { date: 'Apr 22, 2025', type: 'Watered', notes: 'Normal watering' },
    { date: 'Apr 15, 2025', type: 'Watered', notes: 'Added fertilizer' },
];

function EnvBar({ max, absMax }) {
    const fillPct = Math.min(100, (max / absMax) * 100);
    return (
        <div className="env-bar-track">
            <div className="env-bar-fill" style={{ width: `${fillPct}%` }} />
        </div>
    );
}

const PlantInfo = () => {
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [historyExpanded, setHistoryExpanded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [imageMaxHeight, setImageMaxHeight] = useState(null);
    const [justAdded, setJustAdded] = useState(false);
    const imageWrapRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    function handleBack() {
        const { search, page } = location.state || {};
        if (search !== undefined || page !== undefined) {
            navigate('/', { state: { search, page } });
        } else {
            navigate(-1);
        }
    }
    const gardenState = useGardenState(plant || {});

    useEffect(() => {
        getCurrentUser().then(({ authenticated }) => setIsAuthenticated(authenticated));
        loadPlant();
    }, [id]);

    useEffect(() => {
        function updateImageHeight() {
            if (!imageWrapRef.current) return;
            const top = imageWrapRef.current.getBoundingClientRect().top;
            setImageMaxHeight(window.innerHeight - top - 10);
        }
        updateImageHeight();
        window.addEventListener('resize', updateImageHeight);
        return () => window.removeEventListener('resize', updateImageHeight);
    }, [plant]);

    async function loadPlant() {
        setLoading(true);
        const statePlant = location.state?.plant;
        if (statePlant) setPlant(statePlant);
        if (MONGO_ID_PATTERN.test(id)) {
            const result = await getPlantById(id);
            if (result.success) setPlant(result.data);
        }
        setLoading(false);
    }

    if (loading && !plant) return <div className="container py-4">Loading...</div>;
    if (!plant) return <div className="container py-4 text-danger">Plant not found.</div>;

    const { inGarden, addToGarden, removeFromGarden } = gardenState;

    const imageUrl =
        plant.default_image?.regular_url ||
        plant.default_image?.medium_url ||
        plant.default_image?.small_url ||
        plant.default_image?.thumbnail ||
        'https://placehold.co/600x800?text=No+Image';

    const hasTemp = plant.temperature?.min_celsius != null;
    const hasHumidity = plant.humidity?.min_percent != null;
    const hasLight = plant.light?.min_lux != null;
    const hasSoilMoisture = plant.soil_moisture?.min != null;
    const hasEnvData = hasTemp || hasHumidity || hasLight || hasSoilMoisture;

    const tempMinF = hasTemp ? celsiusToFahrenheit(plant.temperature.min_celsius) : null;
    const tempMaxF = hasTemp ? celsiusToFahrenheit(plant.temperature.max_celsius) : null;

    const visibleHistory = historyExpanded
        ? MOCK_WATERING_HISTORY
        : MOCK_WATERING_HISTORY.slice(0, 3);

    return (
        <div className="plant-info-page">
            <div className="plant-info-header">
                <button className="plant-back-btn" onClick={handleBack} aria-label="Go back">&#8592;</button>
                <div className="plant-info-title">
                    <h1 className="plant-name">{toTitleCase(plant.common_name)}</h1>
                    {plant.scientific_name?.length > 0 && (
                        <p className="plant-scientific">{plant.scientific_name.map(toTitleCase).join(', ')}</p>
                    )}
                </div>
                {isAuthenticated && (
                    inGarden ? (
                        <button
                            className={`plant-add-btn in-garden${justAdded ? ' just-added' : ''}`}
                            title="Remove from Your Garden"
                            aria-label="Remove from Your Garden"
                            onClick={removeFromGarden}
                            onMouseLeave={() => setJustAdded(false)}
                        >
                            <span className="garden-btn-default">✓</span>
                            <span className="garden-btn-hovered">×</span>
                        </button>
                    ) : (
                        <button
                            className="plant-add-btn"
                            title="Add to Your Garden"
                            aria-label="Add to Your Garden"
                            onClick={(e) => { addToGarden(e); setJustAdded(true); }}
                        >
                            +
                        </button>
                    )
                )}
            </div>

            <div className="plant-info-content">
                <div
                    className="plant-info-image-wrap"
                    ref={imageWrapRef}
                    style={imageMaxHeight ? { maxHeight: `${imageMaxHeight}px` } : {}}
                >
                    <img src={imageUrl} alt={plant.common_name} className="plant-info-img" />
                </div>

                <div
                    className="plant-info-panel"
                    style={imageMaxHeight ? { maxHeight: `${imageMaxHeight}px` } : {}}
                >
                    {/* Care Snapshot */}
                    <section className="panel-section">
                        <h3 className="section-title">Care Snapshot</h3>
                        <div className="snapshot-tiles">
                            {plant.difficulty && (
                                <div className="snapshot-tile">
                                    <div className="snapshot-icon"><LeafIcon /></div>
                                    <span className="tile-label">{plant.difficulty}</span>
                                    <span className="tile-sub">Great for beginners</span>
                                </div>
                            )}
                            {plant.watering && (
                                <div className="snapshot-tile">
                                    <div className="snapshot-icon"><WaterIcon /></div>
                                    <span className="tile-label">Water</span>
                                    <span className="tile-sub">{plant.watering}</span>
                                </div>
                            )}
                            {plant.sunlight?.length > 0 && (
                                <div className="snapshot-tile">
                                    <div className="snapshot-icon"><SunIcon /></div>
                                    <span className="tile-label">Light</span>
                                    <span className="tile-sub">{plant.sunlight[0]}</span>
                                </div>
                            )}
                            {hasTemp && (
                                <div className="snapshot-tile">
                                    <div className="snapshot-icon"><ThermometerIcon /></div>
                                    <span className="tile-label">Temperature</span>
                                    <span className="tile-sub">
                                        {tempMinF}°F – {tempMaxF}°F<br />
                                        ({plant.temperature.min_celsius}°C – {plant.temperature.max_celsius}°C)
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Environment Ranges */}
                    {hasEnvData && (
                        <section className="panel-section">
                            <h3 className="section-title">Environment Ranges</h3>
                            <div className="env-list">
                                {hasTemp && (
                                    <div className="env-row">
                                        <span className="env-icon"><ThermometerIcon /></span>
                                        <span className="env-label">Temperature</span>
                                        <EnvBar max={tempMaxF} absMax={120} />
                                        <span className="env-value">
                                            {tempMinF}°F – {tempMaxF}°F<br />
                                            ({plant.temperature.min_celsius}°C – {plant.temperature.max_celsius}°C)
                                        </span>
                                    </div>
                                )}
                                {hasHumidity && (
                                    <div className="env-row">
                                        <span className="env-icon"><WaterIcon /></span>
                                        <span className="env-label">Humidity</span>
                                        <EnvBar max={plant.humidity.max_percent} absMax={100} />
                                        <span className="env-value">
                                            {plant.humidity.min_percent}% – {plant.humidity.max_percent}%
                                        </span>
                                    </div>
                                )}
                                {hasLight && (
                                    <div className="env-row">
                                        <span className="env-icon"><SunIcon /></span>
                                        <span className="env-label">Light</span>
                                        <EnvBar max={plant.light.max_lux} absMax={20000} />
                                        <span className="env-value">
                                            {plant.light.min_lux} – {plant.light.max_lux} lux
                                        </span>
                                    </div>
                                )}
                                {hasSoilMoisture && (
                                    <div className="env-row">
                                        <span className="env-icon"><WaterIcon /></span>
                                        <span className="env-label">Soil Moisture</span>
                                        <EnvBar max={plant.soil_moisture.max} absMax={100} />
                                        <span className="env-value">
                                            {plant.soil_moisture.min} – {plant.soil_moisture.max}<br />
                                            (moisture level)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Watering History */}
                    <section className="panel-section">
                        <h3 className="section-title">Watering History</h3>
                        <div className="history-list">
                            {visibleHistory.map((entry, i) => (
                                <div key={i} className="history-row">
                                    <div className="history-icon"><WaterIcon /></div>
                                    <div className="history-meta">
                                        <span className="history-date">{entry.date}</span>
                                        <span className="history-type">{entry.type}</span>
                                    </div>
                                    <span className="history-notes">Notes: {entry.notes}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="view-history-btn"
                            onClick={() => setHistoryExpanded(e => !e)}
                        >
                            View Full History
                            <span className={`chevron ${historyExpanded ? 'chevron-up' : ''}`}>›</span>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PlantInfo;

import { useEffect, useState } from 'react';
import PlantCard from '../PlantCard/PlantCard';
import { getPlants } from '../../services/plantService';
import { getCurrentUser } from '../../services/userService';
import mockData from '../../data/mockData.json';
import { useNavigate } from 'react-router-dom';
import './PlantList.css';

const PlantList = () => {
    const navigate = useNavigate();
    const [plantList, setPlantList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
    const [isAuthenticated, setIsAuthenticated] = useState(DEMO_MODE);

    useEffect(() => {
        if (!DEMO_MODE) {
            getCurrentUser().then(({ authenticated }) => setIsAuthenticated(authenticated));
        }
        loadPlants();
    }, [page]);

    function handleClick(plant) {
        const id = plant._id || plant.id;
        navigate(`/plantinfo/${id}`, { state: { plant } });
    }

    async function loadPlants(searchOverride) {
        setLoading(true);
        const searchTerm = searchOverride !== undefined ? searchOverride : search;
        const result = await getPlants({ page, limit: 20, search: searchTerm || undefined });

        if (result.success && result.data.length > 0) {
            setPlantList(result.data);
            setPagination(result.pagination);
        } else {
            // Fallback to mock data while backend is empty or unavailable
            console.warn('Backend unavailable or empty — using mockData fallback');
            if (searchTerm) {
                const re = new RegExp(`\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
                setPlantList(mockData.data.filter(p =>
                    re.test(p.common_name) || p.scientific_name.some(n => re.test(n))
                ));
            } else {
                setPlantList(mockData.data);
            }
            setPagination(null);
        }
        setLoading(false);
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        setPage(1);
        loadPlants(search);
    }

    function handleSearchChange(e) {
        const val = e.target.value;
        setSearch(val);
        if (val === '') {
            setPage(1);
            loadPlants('');
        }
    }

    return (
        <div className="container py-4">
            <h2>Plant List</h2>

            <form onSubmit={handleSearchSubmit} className="mb-4 d-flex gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search plants..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button type="submit" className="btn btn-success">Search</button>
            </form>

            {loading && <p>Loading plants...</p>}

            <div className="plantList">
                {plantList.map(plant => (
                    <PlantCard
                        plant={plant}
                        key={plant._id || plant.id}
                        onChildClick={() => handleClick(plant)}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>

            {pagination && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <button
                        className="btn btn-outline-secondary"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <button
                        className="btn btn-outline-secondary"
                        disabled={!pagination.hasNext}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlantList;

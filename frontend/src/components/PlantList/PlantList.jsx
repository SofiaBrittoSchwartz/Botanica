import { useEffect, useState } from 'react';
import PlantCard from '../PlantCard/PlantCard';
import { getPlants } from '../../services/plantService';
import { getCurrentUser } from '../../services/userService';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlantList.css';

const PlantList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [plantList, setPlantList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(location.state?.search || '');
    const [page, setPage] = useState(location.state?.page || 1);
    const [pagination, setPagination] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        getCurrentUser().then(({ authenticated }) => setIsAuthenticated(authenticated));
        loadPlants();
    }, [page]);

    function handleClick(plant) {
        const id = plant._id || plant.id;
        navigate(`/plantinfo/${id}`, { state: { plant, search, page } });
    }

    async function loadPlants(searchOverride) {
        setLoading(true);
        const searchTerm = searchOverride !== undefined ? searchOverride : search;
        const result = await getPlants({ page, limit: 20, search: searchTerm || undefined });

        if (result.success) {
            setPlantList(result.data);
            setPagination(result.pagination);
        } else {
            setPlantList([]);
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

    function handleClearSearch() {
        setSearch('');
        setPage(1);
        loadPlants('');
    }

    return (
        <div className="container py-4">
            <h2>Plant List</h2>

            {loading && <p>Loading plants...</p>}

            <div className="plantList">
                <form onSubmit={handleSearchSubmit} className="plantList-search d-flex gap-2">
                    <div className="plantList-input-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search plants..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        {search && (
                            <button
                                type="button"
                                className="plantList-clear-btn"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                    <button type="submit" className="btn btn-success">Search</button>
                </form>
                {!loading && plantList.length === 0 && (
                    <p className="plantList-empty">No plants found.</p>
                )}
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

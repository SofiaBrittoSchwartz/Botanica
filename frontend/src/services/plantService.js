import axios from 'axios';

const API_URL = 'http://localhost:5001/api/plants';

/**
 * Fetch a paginated, optionally filtered list of plants.
 * @param {Object} params - { page, limit, search, watering, cycle }
 */
export async function getPlants(params = {}) {
    try {
        const response = await axios.get(API_URL, { params });
        return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
        console.error('plantService.getPlants error:', error);
        return {
            success: false,
            data: [],
            pagination: null,
            message: error.response?.data?.message || 'Failed to fetch plants',
        };
    }
}

/**
 * Fetch a single plant by its MongoDB _id.
 * @param {string} id - MongoDB ObjectId string
 */
export async function getPlantById(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('plantService.getPlantById error:', error);
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || 'Failed to fetch plant',
        };
    }
}

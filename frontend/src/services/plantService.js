import axios from 'axios';
import mockData from '../data/mockData.json';

const API_URL = 'http://localhost:5001/api/plants';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

function normalizeImagePath(plant) {
    const url = plant.image_url;
    if (!url?.startsWith('/plant-images/')) return plant;
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    return { ...plant, image_url: base + url };
}

export async function getPlants(params = {}) {
    if (DEMO_MODE) {
        let plants = mockData.data;
        if (params.search) {
            const re = new RegExp(`\\b${params.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
            plants = plants.filter(p =>
                re.test(p.common_name) || p.scientific_name.some(n => re.test(n))
            );
        }
        if (params.watering) plants = plants.filter(p => p.watering === params.watering);
        if (params.cycle) plants = plants.filter(p => p.cycle === params.cycle);
        return { success: true, data: plants.map(normalizeImagePath), pagination: null };
    }

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

export async function getPlantById(id) {
    if (DEMO_MODE) {
        const plant = mockData.data.find(p => String(p.id) === String(id));
        return plant
            ? { success: true, data: normalizeImagePath(plant) }
            : { success: false, data: null, message: 'Plant not found' };
    }

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

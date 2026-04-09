const Plant = require('../models/Plant');

const getPlants = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.search) filter.$text = { $search: req.query.search };
        if (req.query.watering) filter.watering = req.query.watering;
        if (req.query.cycle) filter.cycle = req.query.cycle;

        const [plants, total] = await Promise.all([
            Plant.find(filter)
                .skip(skip)
                .limit(limit)
                .select('common_name cycle watering sunlight difficulty default_image sources'),
            Plant.countDocuments(filter)
        ]);

        res.json({
            data: plants,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total
            }
        })
    } catch (e) {
        res.status(500).json({ message: `Failed to fetch plants: ${e}` });
    }
};

const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);

        if (!plant) return res.status(404).json({ message: `Plant not found` });

        res.json(plant);
    } catch (e) {
        // When id format is invalid (non-hex string), Mongoose throws CastError before hitting the DB
        // Triggered by bad input, not a server error
        if (e.name === 'CastError') return res.status(404).json({ message: `Plant not found` });
        res.status(500).json({ message: `Failed to fetch plant: ${e}` });
    }
};

module.exports = { getPlants, getPlantById };
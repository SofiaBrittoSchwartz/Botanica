const express = require('express');
const { getPlants, getPlantById } = require('../controllers/plantController');
const router = express.Router();

router.get('/', getPlants);
router.get('/:id', getPlantById);

module.exports = router;
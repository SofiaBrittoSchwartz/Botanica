require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const mockData = require('../../frontend/src/data/mockData.json');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let upserted = 0;

    for (const item of mockData.data) {
        const plantData = {
            perenual_id:     item.id,
            common_name:     item.common_name,
            scientific_name: item.scientific_name || [],
            other_name:      item.other_name || [],
            cycle:           item.cycle || null,
            watering:        item.watering || null,
            sunlight:        item.sunlight || [],
            default_image:   item.default_image
                ? {
                    thumbnail:    item.default_image.thumbnail    || null,
                    small_url:    item.default_image.small_url    || null,
                    medium_url:   item.default_image.medium_url   || null,
                    regular_url:  item.default_image.regular_url  || null,
                    original_url: item.default_image.original_url || null,
                    license_url:  item.default_image.license_url  || null,
                }
                : {},
            sources: ['perenual'],
        };

        await Plant.findOneAndUpdate(
            { perenual_id: item.id },
            { $set: plantData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`Upserted: ${item.common_name}`);
        upserted++;
    }

    console.log(`\nDone. ${upserted} plants upserted.`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Plant = require('../models/Plant');

const JSON_PATH = path.join(__dirname, 'data', 'kaggle_plants.json');

function mapItemToPlant(item) {
    const common = item.common || [];
    return {
        common_name:     common[0] || item.latin || '',
        scientific_name: item.latin ? [item.latin] : [],
        other_name:      common.slice(1),
        sunlight:        item.ideallight ? [item.ideallight] : [],
        watering:        item.watering   || null,
        temperature: {
            max_celsius: item.tempmax?.celsius ?? null,
            min_celsius: item.tempmin?.celsius ?? null,
        },
    };
}

async function seed() {
    if (!fs.existsSync(JSON_PATH)) {
        console.error(`JSON not found at: ${JSON_PATH}`);
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const items = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`Loaded ${items.length} plants from JSON`);

    let processed = 0, skipped = 0, errors = 0;

    for (const item of items) {
        const plantData = mapItemToPlant(item);

        if (!plantData.common_name) {
            skipped++;
            continue;
        }

        try {
            // Try to match by scientific name first, then common name
            const existing = await Plant.findOne({
                $or: [
                    { scientific_name: { $in: plantData.scientific_name } },
                    { common_name: { $regex: new RegExp(`^${plantData.common_name}$`, 'i') } },
                ],
            });

            if (existing) {
                // Enrich — only fill in fields that are currently empty/null
                const updates = {};
                if (!existing.watering  && plantData.watering)              updates.watering  = plantData.watering;
                if (!existing.sunlight?.length && plantData.sunlight?.length) updates.sunlight = plantData.sunlight;
                if (!existing.scientific_name?.length && plantData.scientific_name?.length) {
                    updates.scientific_name = plantData.scientific_name;
                }
                if (existing.temperature?.max_celsius == null && plantData.temperature?.max_celsius != null) {
                    updates.temperature = plantData.temperature;
                }
                if (!existing.sources.includes('kaggle')) {
                    updates.$push = { sources: 'kaggle' };
                }

                if (Object.keys(updates).length > 0) {
                    await Plant.findByIdAndUpdate(existing._id, updates);
                    console.log(`Enriched:  ${plantData.common_name}`);
                } else {
                    console.log(`No update: ${plantData.common_name} (already complete)`);
                }
            } else {
                await Plant.create({ ...plantData, sources: ['kaggle'] });
                console.log(`Inserted:  ${plantData.common_name}`);
            }

            processed++;
        } catch (err) {
            console.error(`Error for "${plantData.common_name}": ${err.message}`);
            errors++;
        }
    }

    console.log(`\nDone. Processed: ${processed}, Skipped: ${skipped}, Errors: ${errors}`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});

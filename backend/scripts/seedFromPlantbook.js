require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Plant = require('../models/Plant');

const PLANTBOOK_BASE = 'https://open.plantbook.io/api/v1';
const CLIENT_ID     = process.env.PLANTBOOK_CLIENT_ID;
const CLIENT_SECRET = process.env.PLANTBOOK_CLIENT_SECRET;
const DELAY_MS = 500; // 0.5s between requests to stay within rate limits

async function getAccessToken() {
    const response = await fetch(`${PLANTBOOK_BASE}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=client_credentials&client_id=${encodeURIComponent(CLIENT_ID)}&client_secret=${encodeURIComponent(CLIENT_SECRET)}`,
    });
    if (!response.ok) throw new Error(`Token request failed: HTTP ${response.status}`);
    const data = await response.json();
    return data.access_token;
}

const CSV_PATH = path.join(__dirname, 'data', 'plants_to_seed.csv');

function loadPlantsFromCSV() {
    const raw = fs.readFileSync(CSV_PATH, 'utf8');
    const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true });
    return rows.map(row => ({
        common_name:     row.common_name,
        plantbook_alias: row.plantbook_alias || row.common_name,
        plantbook_pid:   row.plantbook_pid || null,
    }));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithAuth(url, token) {
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return response.json();
}

async function searchPlant(alias, token) {
    const url = `${PLANTBOOK_BASE}/plant/search?alias=${encodeURIComponent(alias)}&limit=1`;
    const data = await fetchWithAuth(url, token);
    return data.results || [];
}

async function fetchPlantDetail(pid, token) {
    const url = `${PLANTBOOK_BASE}/plant/detail/${encodeURIComponent(pid)}/`;
    return fetchWithAuth(url, token);
}

function mapToPlant(detail) {
    return {
        plantbook_pid:         detail.pid         || null,
        plantbook_display_pid: detail.display_pid || null,
        common_name:           detail.alias || detail.display_pid || detail.pid,
        scientific_name:       detail.alias ? [detail.alias] : [],
        light: {
            max_mmol: detail.max_light_mmol ?? null,
            min_mmol: detail.min_light_mmol ?? null,
            max_lux:  detail.max_light_lux  ?? null,
            min_lux:  detail.min_light_lux  ?? null,
        },
        temperature: {
            max_celsius: detail.max_temp ?? null,
            min_celsius: detail.min_temp ?? null,
        },
        humidity: {
            max_percent: detail.max_env_humid ?? null,
            min_percent: detail.min_env_humid ?? null,
        },
        soil_moisture: {
            max: detail.max_soil_moist ?? null,
            min: detail.min_soil_moist ?? null,
        },
        soil_ec: {
            max: detail.max_soil_ec ?? null,
            min: detail.min_soil_ec ?? null,
        },
        ph: {
            max: detail.ph_max ?? null,
            min: detail.ph_min ?? null,
        },
        sources: ['plantbook'],
    };
}

async function seed() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('PLANTBOOK_CLIENT_ID or PLANTBOOK_CLIENT_SECRET is not set in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Fetching Plantbook access token...');
    const token = await getAccessToken();
    console.log('Token acquired.');

    const plants = loadPlantsFromCSV();
    console.log(`Loaded ${plants.length} plants from CSV`);

    let upserted = 0, skipped = 0, errors = 0;

    for (const { common_name, plantbook_alias, plantbook_pid } of plants) {
        try {
            let pid;

            if (plantbook_pid) {
                console.log(`Direct lookup: ${common_name} (pid: ${plantbook_pid})`);
                pid = plantbook_pid;
            } else {
                console.log(`Searching: ${common_name} (alias: ${plantbook_alias})`);
                const results = await searchPlant(plantbook_alias, token);
                await sleep(DELAY_MS);

                if (results.length === 0) {
                    console.log(`  No results for "${plantbook_alias}", skipping`);
                    skipped++;
                    continue;
                }

                pid = results[0].pid;
                console.log(`  Found pid: ${pid}, fetching detail...`);
            }
            const detail = await fetchPlantDetail(pid, token);
            await sleep(DELAY_MS);

            const plantData = mapToPlant(detail);

            const result = await Plant.findOneAndUpdate(
                { plantbook_pid: pid },
                { $set: plantData },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            console.log(`  Upserted: ${result.common_name}`);
            upserted++;
        } catch (err) {
            console.error(`  Error for "${name}": ${err.message}`);
            errors++;
        }
    }

    console.log(`\nDone. Upserted: ${upserted}, Skipped: ${skipped}, Errors: ${errors}`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});

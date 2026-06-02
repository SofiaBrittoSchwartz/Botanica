const mongoose = require('mongoose');

const toxicitySchema = new mongoose.Schema({
    toxic_to_humans: { type: Boolean, default: null },
    toxic_to_pets:   { type: Boolean, default: null },
    notes:           { type: String,  default: null }
}, { _id: false });

const defaultImageSchema = new mongoose.Schema({
    thumbnail:    { type: String, default: null },
    small_url:    { type: String, default: null },
    medium_url:   { type: String, default: null },
    regular_url:  { type: String, default: null },
    original_url: { type: String, default: null },
    license:      { type: String, default: null },
    license_url:  { type: String, default: null }
}, { _id: false });

const plantSchema = new mongoose.Schema({
    // Identity
    common_name: {
        type: String,
        required: true,
        trim: true
    },
    scientific_name: {
        type: [String],
        default: []
    },
    other_name: {
        type: [String],
        default: []
    },
    // External source IDs (for deduplication in seed scripts)
    perenual_id: {
        type: Number,
        default: null
    },
    plantbook_pid: {
        type: String,
        default: null
    },
    plantbook_display_pid: {
        type: String,
        default: null
    },
    // Human-readable care info (from mockData / Kaggle)
    cycle: {
        type: String,
        default: null
    },
    watering: {
        type: String,
        default: null
    },
    sunlight: {
        type: [String],
        default: []
    },
    difficulty: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    toxicity: { type: toxicitySchema, default: () => ({}) },
    // Numeric environment ranges from Open Plantbook
    light: {
        max_mmol: {
            type: Number,
            default: null
        },
        min_mmol: {
            type: Number,
            default: null
        },
        max_lux: {
            type: Number,
            default: null
        },
        min_lux: {
            type: Number,
            default: null
        }
    },
    temperature: {
        max_celsius: {
            type: Number,
            default: null
        },
        min_celsius: {
            type: Number,
            default: null
        }
    },
    humidity: {
        max_percent: {
            type: Number,
            default: null
        },
        min_percent: {
            type: Number,
            default: null
        }
    },
    soil_moisture: {
        max: {
            type: Number,
            default: null
        },
        min: {
            type: Number,
            default: null
        }
    },
    soil_ec: {
        max: {
            type: Number,
            default: null
        },
        min: {
            type: Number,
            default: null
        }
    },
    ph: {
        max: {
            type: Number,
            default: null
        },
        min: {
            type: Number,
            default: null
        }
    },
    // Images
    default_image: { type: defaultImageSchema, default: () => ({}) },
    // Provenance - where the plant's data came from. 
    // Useful for debugging data quality issues
    sources: {
        type: [String],
        default: []
    }
}, { timestamps: true });

plantSchema.index(
    { common_name: 'text', scientific_name: 'text', other_name: 'text' }
);
plantSchema.index({ perenual_id: 1 }, { sparse: true });
plantSchema.index({ plantbook_pid: 1 }, { sparse: true });

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;

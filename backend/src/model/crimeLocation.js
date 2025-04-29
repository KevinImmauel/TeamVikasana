const mongoose = require('mongoose');
const { getMainDb } = require('../database/db');
const { Schema } = mongoose;

const CrimeLocationSchema = new Schema({
    location: {
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        required: true
    },
    station_id: { type: String, required: true },
    seriousness: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: true
    },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = getMainDb().model('CrimeLocation', CrimeLocationSchema);

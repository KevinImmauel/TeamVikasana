const mongoose = require('mongoose');
const { getMainDb } = require('../database/db');
const { Schema } = mongoose;

const StationSchema = new Schema({
    stationId: { type: String, unique: true },
    stationName: String,
    stationLocation: {
        latitude: Number,
        longitude: Number
    },
    circleId: String // optionally use ref: 'Circle'
}, { timestamps: true });

module.exports = getMainDb().model('Station', StationSchema);

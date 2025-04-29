const mongoose = require('mongoose');
const { getMainDb } = require('../database/db');
const { Schema } = mongoose;

const DistrictSchema = new Schema({
    districtId: { type: String, unique: true },
    districtName: String,
    state: String,
    country: String
}, { timestamps: true });

module.exports = getMainDb().model('District', DistrictSchema);

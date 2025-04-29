const mongoose = require('mongoose');
const { getMainDb } = require('../database/db');
const { Schema } = mongoose;

const CircleSchema = new Schema({
    circleId: { type: String, unique: true },
    circleName: String,
    districtId: String // optionally use ref: 'District' if you want relational queries
}, { timestamps: true });

module.exports = getMainDb().model('Circle', CircleSchema);

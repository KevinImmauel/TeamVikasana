const mongoose = require('mongoose');
const {getMainDb} = require('../database/db');
const {Schema} = mongoose

const SOSScehma = new Schema({
  triggered_by: String,
  station_id: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  emergency_type: String,
  timestamp: Date,
  status: { type: String, default: 'Active' },
  responded_by: String
}, { timestamps: true });

module.exports = getMainDb().model('SOS', SOSScehma);

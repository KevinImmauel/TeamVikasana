const mongoose = require('mongoose');
const {getMainDb} = require('../database/db');
const {Schema} = mongoose

const IncidentSchema = new Schema({
  beat_id: String,
  reported_by: String,
  station_id: String,
  incident_type: String,
  description: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  attachments: [Object],
  reported_at: Date,
  status: { type: String, default: 'Pending Review' }
}, { timestamps: true });

module.exports = getMainDb().model('Incident', IncidentSchema);

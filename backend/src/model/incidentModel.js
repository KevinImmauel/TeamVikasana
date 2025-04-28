const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Incident', IncidentSchema);

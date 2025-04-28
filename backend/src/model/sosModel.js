const mongoose = require('mongoose');

const SOSScehma = new mongoose.Schema({
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

module.exports = mongoose.model('SOS', SOSScehma);

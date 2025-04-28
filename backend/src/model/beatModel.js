const mongoose = require('mongoose');
const {getMainDb} = require('../database/db');
const {Schema} = mongoose

const BeatSchema = new Schema({
  station_id: String,
  beat_id: String,
  assigned_to: String, // user_id of constable
  assigned_by: String, // SHO user_id
  area_covered: [String],
  start_time: Date,
  end_time: Date,
  priority_level: String,
  special_instructions: String,
  status: { type: String, default: 'Assigned' }
}, { timestamps: true });

module.exports = getMainDb().model('Beat', BeatSchema);

const mongoose = require('../database/db');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['SuperAdmin', 'SP', 'DSP', 'CI', 'SHO', 'SI', 'ASI', 'Constable', 'ControlRoom'] },
  station_id: String,
  circle: String,
  district: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

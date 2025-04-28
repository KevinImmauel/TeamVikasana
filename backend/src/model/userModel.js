const mongoose = require('mongoose');
const {getMainDb} = require('../database/db');
const {Schema} = mongoose

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['SUPERADMIN', 'SP', 'DSP', 'CI', 'SHO', 'SI', 'ASI', 'CONSTABLE', 'CONTROLROOM'] },
  station_id: String,
  circle: String,
  district: String
}, { timestamps: true });

module.exports = getMainDb().model('User', UserSchema);

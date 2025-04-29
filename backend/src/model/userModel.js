const mongoose = require('mongoose');
const { getMainDb } = require('../database/db');
const { Schema } = mongoose;

// Define the User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    trim: true, 
  },
  role: {
    type: String,
    enum: ['SUPERADMIN', 'SP', 'DSP', 'CI', 'SHO', 'SI', 'ASI', 'CONSTABLE', 'CONTROLROOM'],
    required: true,
  },
  station_id: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


module.exports = getMainDb().model('User', UserSchema);

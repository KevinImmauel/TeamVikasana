const Beat = require('../models/Beat.model');

exports.assignBeat = async (req, res) => {
  const { beat_id, assigned_to, assigned_by, area_covered, start_time, end_time, priority_level, special_instructions } = req.body;
  const beat = new Beat({ beat_id, assigned_to, assigned_by, area_covered, start_time, end_time, priority_level, special_instructions, station_id: req.user.station_id });
  await beat.save();
  res.json({ message: 'Beat assigned successfully', beat });
};

exports.getBeats = async (req, res) => {
  const beats = await Beat.find({ station_id: req.user.station_id });
  res.json(beats);
};

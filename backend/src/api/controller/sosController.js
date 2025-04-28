const SOS = require('../models/SOS.model');

exports.triggerSOS = async (req, res) => {
  const { location, emergency_type } = req.body;
  const sos = new SOS({
    triggered_by: req.user.id,
    station_id: req.user.station_id,
    location,
    emergency_type,
    timestamp: new Date()
  });
  await sos.save();
  res.json({ message: 'SOS triggered!', sos });
};

exports.getActiveSOS = async (req, res) => {
  const sos = await SOS.find({ station_id: req.user.station_id, status: 'Active' });
  res.json(sos);
};

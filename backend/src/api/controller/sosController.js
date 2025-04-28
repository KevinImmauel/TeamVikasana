const sosModel = require('../../model/sosModel');

exports.triggerSOS = async (req, res) => {
  const { location, emergency_type } = req.body;
  const sos = new sosModel({
    triggered_by: req.user.id,
    station_id: req.user.station_id,
    location,
    emergency_type,
    timestamp: new Date()
  });
  await sos.save();
  res.json({ message: 'SOS triggered!', sos });
};

exports.storedSOS = async (req, res) => {
  try {
    const sos = await sosModel.find({});
    res.status(200).json({ sos });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};



  exports.getActiveSOS = async (req, res) => {
    const sos = await sosModel.find({ station_id: req.user.station_id, status: 'Active' });
    res.json(sos);
  };

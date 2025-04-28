const Incident = require('../models/Incident.model');

exports.reportIncident = async (req, res) => {
  const { beat_id, incident_type, description, location, attachments } = req.body;
  const incident = new Incident({
    beat_id,
    reported_by: req.user.id,
    station_id: req.user.station_id,
    incident_type,
    description,
    location,
    attachments,
    reported_at: new Date()
  });
  await incident.save();
  res.json({ message: 'Incident reported successfully', incident });
};

exports.getIncidents = async (req, res) => {
  const incidents = await Incident.find({ station_id: req.user.station_id });
  res.json(incidents);
};

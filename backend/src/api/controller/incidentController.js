const Incident = require('../../model/incidentModel');
const { extractUserFromToken } = require("../../util/extractUserFromToken")

exports.reportIncident = async (req, res) => {
  const { beat_id, incident_type, description, location, attachments } = req.body;
  const userData = extractUserFromToken(req);
  const incident = new Incident({
    beat_id,
    reported_by: userData.id,
    station_id: "1",
    incident_type,
    description,
    location,
    attachments,
    reported_at: new Date()
  });
  console.log(incident);
  await incident.save();
  res.json({ message: 'Incident reported successfully', incident });
};

exports.getIncidents = async (req, res) => {
  const incidents = await Incident.find({});
  console.log(incidents);
  // { station_id: req.user.station_id }
  res.json(incidents);
};

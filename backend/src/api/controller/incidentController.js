const Incident = require('../../model/incidentModel');
const user = require('../../model/userModel');
const { extractUserFromToken } = require("../../util/extractUserFromToken")
const fs = require("fs");
const path = require("path");
const upload = require("../../middleware/upload");
const { error } = require('console');
const { logCrimeLocationAsync } = require('../../util/logCrimeLocation');


exports.reportIncident = async (req, res) => {
  const { beat_id, incident_type, description, location } = req.body;

  const userData = extractUserFromToken(req);

  const getStation = await user.findOne({ _id: userData.id });
  // console.log(getStation);

  const incident = new Incident({
    beat_id,
    reported_by: userData.id,
    station_id: getStation.station_id,
    incident_type,
    description,
    location,
    reported_at: new Date(),
  });

  try {
    const savedIncident = await incident.save();

    logCrimeLocationAsync({
      location,
      seriousness: 'MEDIUM',
      station_id: getStation.station_id,
      description
    })

    // Respond with success
    res.json({ message: 'Incident reported successfully', incident: savedIncident });
  } catch (error) {
    console.error('Error saving incident:', error);
    res.status(500).json({ error: 'Failed to report incident' });
  }
};



exports.getIncidents = async (req, res) => {
  const incidents = await Incident.find({});
  // console.log(incidents);
  // { station_id: req.user.station_id }
  res.json(incidents);
};


exports.getCrimeAnalytics = async (req, res) => {
  try {

    const aggregateResults = await Incident.aggregate([
      { $match: { station_id: req.user.station_id } },
      {
        $group: {
          _id: "$incident_type", 
          count: { $sum: 1 }     
        }
      },
      { $project: { _id: 0, incident_type: "$_id", count: 1 } },
    ]);

    res.json(aggregateResults);
  } catch (error) {
    console.error('Error fetching crime analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getCrimeAnalyticsPerStation = async (req, res) => {
  try {
    const rawResults = await Incident.aggregate([
      {
        $group: {
          _id: {
            station_id: "$station_id",
            incident_type: { $ifNull: ["$incident_type", "Other"] }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.station_id",
          incidents: {
            $push: {
              incident_type: "$_id.incident_type",
              count: "$count"
            }
          },
          total: { $sum: "$count" }
        }
      },
      {
        $project: {
          _id: 0,
          station_id: "$_id",
          incidents: {
            $map: {
              input: "$incidents",
              as: "i",
              in: {
                incident_type: "$$i.incident_type",
                count: "$$i.count",
                percentage: {
                  $round: [
                    { $multiply: [{ $divide: ["$$i.count", "$total"] }, 100] },
                    2
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    res.json(rawResults);
  } catch (error) {
    console.error('Error fetching per-station analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

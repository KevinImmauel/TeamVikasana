const Station = require('../../model/stationModel');

// Create stations (single or multiple)
exports.createStation = async (req, res) => {
    try {
        const stationsData = Array.isArray(req.body) ? req.body : [req.body];
        const stations = await Station.insertMany(stationsData);
        return res.status(201).json(stations);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all stations
exports.getAllStations = async (req, res) => {
    try {
        const stations = await Station.find();
        return res.status(200).json(stations);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a station by ID
exports.getStationById = async (req, res) => {
    try {
        const station = await Station.findOne({ stationId: req.params.stationId });
        if (!station) return res.status(404).json({ error: 'Station not found' });
        return res.status(200).json(station);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update station by ID (single)
exports.updateStation = async (req, res) => {
    try {
        const { stationName, stationLocation, circleId } = req.body;
        const updatedStation = await Station.findOneAndUpdate(
            { stationId: req.params.stationId },
            { stationName, stationLocation, circleId },
            { new: true }
        );
        if (!updatedStation) return res.status(404).json({ error: 'Station not found' });
        return res.status(200).json(updatedStation);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete station by ID (single or multiple)
exports.deleteStation = async (req, res) => {
    try {
        const stationIds = Array.isArray(req.body.stationIds) ? req.body.stationIds : [req.body.stationIds];
        const deletedStations = await Station.deleteMany({ stationId: { $in: stationIds } });
        if (deletedStations.deletedCount === 0) return res.status(404).json({ error: 'Station(s) not found' });
        return res.status(200).json({ message: 'Station(s) deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

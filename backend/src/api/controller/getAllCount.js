const Beat = require('../../model/beatModel');
const Incident = require('../../model/incidentModel');
const Sos = require('../../model/sosModel');

const getCounts = async (req, res) => {
    try {
        const beatsCount = await Beat.countDocuments({});
        const incidentsCount = await Incident.countDocuments({});
        const sosCount = await Sos.countDocuments({});

        // Respond with the counts
        res.status(200).json({
            beatsCount,
            incidentsCount,
            sosCount,
        });
    } catch (error) {
        console.error('Error getting counts:', error);
        res.status(500).json({ message: 'Failed to get counts' });
    }
};

module.exports = { getCounts };

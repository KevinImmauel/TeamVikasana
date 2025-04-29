const CrimeLocation = require('../model/crimeLocation');

exports.logCrimeLocationAsync = async ({ location, station_id, seriousness, description = '' }) => {
    try {
        await CrimeLocation.create({
            location,
            station_id,
            seriousness,
            description
        });
    } catch (err) {
        console.error('Failed to log crime location:', err);
    }
};

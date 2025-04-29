const CrimeLocation = require('../../model/crimeLocation');

exports.addCrimeLocations = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const inserted = await CrimeLocation.insertMany(data);
        res.status(201).json({ message: 'Crime location(s) added', data: inserted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving crime location(s)' });
    }
};

exports.getAllCrimeLocations = async (req, res) => {
    try {
        const crimes = await CrimeLocation.find();
        res.status(200).json(crimes);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data' });
    }
};

// exports.getCrimeLocationById = async (req, res) => {
//     try {
//         const crime = await CrimeLocation.findById(req.params.id);
//         if (!crime) return res.status(404).json({ message: 'Not found' });
//         res.status(200).json(crime);
//     } catch (err) {
//         res.status(500).json({ message: 'Error retrieving crime location' });
//     }
// };

// exports.updateCrimeLocation = async (req, res) => {
//     try {
//         const updated = await CrimeLocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updated) return res.status(404).json({ message: 'Not found' });
//         res.status(200).json(updated);
//     } catch (err) {
//         res.status(500).json({ message: 'Error updating crime location' });
//     }
// };

// exports.deleteCrimeLocations = async (req, res) => {
//     try {
//         const ids = Array.isArray(req.body.ids) ? req.body.ids : [req.body.id];
//         const result = await CrimeLocation.deleteMany({ _id: { $in: ids } });
//         res.status(200).json({ message: 'Deleted successfully', deletedCount: result.deletedCount });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deleting crime location(s)' });
//     }
// };

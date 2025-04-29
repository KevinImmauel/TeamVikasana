const District = require('../../model/districtModel'); // Import the District model

// Create districts (single or multiple)
exports.createDistrict = async (req, res) => {
    try {
        const districtsData = Array.isArray(req.body) ? req.body : [req.body];
        const districts = await District.insertMany(districtsData); // Supports both single and multiple
        return res.status(201).json(districts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all districts
exports.getAllDistricts = async (req, res) => {
    try {
        const districts = await District.find();
        return res.status(200).json(districts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a district by ID
exports.getDistrictById = async (req, res) => {
    try {
        const district = await District.findOne({ districtId: req.params.districtId });
        if (!district) return res.status(404).json({ error: 'District not found' });
        return res.status(200).json(district);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update district by ID (single)
exports.updateDistrict = async (req, res) => {
    try {
        const { districtName, state, country } = req.body;
        const updatedDistrict = await District.findOneAndUpdate(
            { districtId: req.params.districtId },
            { districtName, state, country },
            { new: true }
        );
        if (!updatedDistrict) return res.status(404).json({ error: 'District not found' });
        return res.status(200).json(updatedDistrict);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete district by ID (single or multiple)
exports.deleteDistrict = async (req, res) => {
    try {
        const districtIds = Array.isArray(req.body.districtIds) ? req.body.districtIds : [req.body.districtIds];
        const deletedDistricts = await District.deleteMany({ districtId: { $in: districtIds } });
        if (deletedDistricts.deletedCount === 0) return res.status(404).json({ error: 'District(s) not found' });
        return res.status(200).json({ message: 'District(s) deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

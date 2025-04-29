const Circle = require('../../model/circleModel'); 


exports.createCircle = async (req, res) => {
    try {
        const circlesData = Array.isArray(req.body) ? req.body : [req.body];
        const circles = await Circle.insertMany(circlesData); // Supports both single and multiple
        return res.status(201).json(circles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.getAllCircles = async (req, res) => {
    try {
        const circles = await Circle.find();
        return res.status(200).json(circles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.getCircleById = async (req, res) => {
    try {
        const circle = await Circle.findOne({ circleId: req.params.circleId });
        if (!circle) return res.status(404).json({ error: 'Circle not found' });
        return res.status(200).json(circle);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateCircle = async (req, res) => {
    try {
        const { circleName, districtId } = req.body;
        const updatedCircle = await Circle.findOneAndUpdate(
            { circleId: req.params.circleId },
            { circleName, districtId },
            { new: true }
        );
        if (!updatedCircle) return res.status(404).json({ error: 'Circle not found' });
        return res.status(200).json(updatedCircle);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.deleteCircle = async (req, res) => {
    try {
        const circleIds = Array.isArray(req.body.circleIds) ? req.body.circleIds : [req.body.circleIds];
        const deletedCircles = await Circle.deleteMany({ circleId: { $in: circleIds } });
        if (deletedCircles.deletedCount === 0) return res.status(404).json({ error: 'Circle(s) not found' });
        return res.status(200).json({ message: 'Circle(s) deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

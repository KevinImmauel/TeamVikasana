const User = require('../../model/userModel');
const Station = require('../../model/stationModel');

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getAllUsersBasicInfo = async (req, res) => {
    try {
        const users = await User.find().select('_id role name station_id');

        const stationMap = {};
        const stationIds = [...new Set(users.map(u => u.station_id))];
        const stations = await Station.find({ stationId: { $in: stationIds } }).select('stationId stationName');

        stations.forEach(station => {
            stationMap[station.stationId] = station.stationName;
        });

        const response = users.map(user => ({
            id: user._id,
            rank: user.role,
            name: user.name,
            stationName: stationMap[user.station_id] || 'Unknown Station',
            stationId: user.station_id
        }));

        res.json({ users: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

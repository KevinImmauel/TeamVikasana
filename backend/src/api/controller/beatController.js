const Beat = require('../../model/beatModel');
const { extractUserFromToken }  = require("../../util/extractUserFromToken")
// Assign a new beat
exports.assignBeat = async (req, res) => {
  try {
    const { beat_id, assigned_to, area_covered, priority_level, special_instructions } = req.body;
    const userData = extractUserFromToken(req);
    console.log(userData)
    const beat = new Beat({
      beat_id,
      assigned_to,
      assigned_by: userData.id,
      area_covered,
      priority_level,
      special_instructions,
      // station_id: req.user.station_id,
    });

    await beat.save();
    res.status(201).json({ message: 'Beat assigned successfully', beat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign beat', error: error.message });
  }
};

// Get all beats for a station
exports.getBeats = async (req, res) => {
  try {
    const beats = await Beat.find({});
    // { station_id: req.user.station_id }
    res.status(200).json(beats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch beats', error: error.message });
  }
};

// Get a single beat by ID
exports.getBeatById = async (req, res) => {
  try {
    const beat = await Beat.findOne({ _id: req.params.id, station_id: req.user.station_id });
    if (!beat) {
      return res.status(404).json({ message: 'Beat not found' });
    }
    res.status(200).json(beat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch beat', error: error.message });
  }
};

// Update a beat
exports.updateBeat = async (req, res) => {
  try {
    const updatedBeat = await Beat.findOneAndUpdate(
      { _id: req.params.id, station_id: req.user.station_id },
      req.body,
      { new: true }
    );

    if (!updatedBeat) {
      return res.status(404).json({ message: 'Beat not found' });
    }

    res.status(200).json({ message: 'Beat updated successfully', beat: updatedBeat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update beat', error: error.message });
  }
};

// Delete a beat
exports.deleteBeat = async (req, res) => {
  try {
    const deletedBeat = await Beat.findOneAndDelete({ _id: req.params.id, station_id: req.user.station_id });

    if (!deletedBeat) {
      return res.status(404).json({ message: 'Beat not found' });
    }

    res.status(200).json({ message: 'Beat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete beat', error: error.message });
  }
};

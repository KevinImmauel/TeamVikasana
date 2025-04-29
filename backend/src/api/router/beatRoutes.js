const express = require('express');
const router = express.Router();
const beatController = require('../controller/beatController');

// Middlewares like auth middleware should be added if needed
// Example: const { authenticateUser } = require('../middlewares/auth');

// router.use(authenticateUser);

router.post('/', beatController.assignBeat);
router.get('/', beatController.getBeats);
router.get('/:id', beatController.getBeatById);
router.put('/:id', beatController.updateBeat);
router.delete('/:id', beatController.deleteBeat);

module.exports = router;

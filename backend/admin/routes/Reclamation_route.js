const express = require('express');
const router = express.Router();
const controller = require('../controllers/Reclamation_controller');

router.get('/reclamations', controller.get_reclamations);
router.post('/reclamations', controller.create_reclamation);

module.exports = router;
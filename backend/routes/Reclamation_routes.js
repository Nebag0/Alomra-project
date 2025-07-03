const express = require('express');
const router = express.Router();
const controller = require('../controllers/Reclamation_controller');

router.get('/reclamations', controller.get_reclamations);
router.post('/reclamations', controller.create_reclamation);
router.put('/reclamations/:id', controller.update_reclamation);
router.delete('/reclamations/:id', controller.delete_reclamation);
router.get('/reclamations/:id', controller.get_reclamation_by_id);

module.exports = router;
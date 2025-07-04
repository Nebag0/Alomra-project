const express = require('express');
const router = express.Router();
const controller = require('../controllers/Reclamation_controller');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authRole');

router.get('/reclamations', authenticateToken, authorizeRoles('superviseur'), controller.get_reclamations_by_user);
router.post('/reclamations', authenticateToken, authorizeRoles('superviseur'), controller.create_reclamation);
router.put('/reclamations/:id', authenticateToken, authorizeRoles('superviseur'), controller.update_reclamation);
router.delete('/reclamations/:id', authenticateToken, authorizeRoles('superviseur'), controller.delete_reclamation);
router.get('/reclamations/:id', authenticateToken, authorizeRoles('superviseur'), controller.get_reclamation_by_id);

module.exports = router;
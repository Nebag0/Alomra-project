const express = require('express');
const router = express.Router();
const controller = require('../controllers/Reclamation_controller');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authRole');
const { get_reclamations_essentielles, get_motifs } = require('../controllers/Reclamation_controller');

router.get('/reclamations', authenticateToken, authorizeRoles('superviseur'), controller.get_reclamations_by_user);
router.post('/reclamations', authenticateToken, authorizeRoles('superviseur'), controller.create_reclamation);
router.put('/reclamations/:id', authenticateToken, authorizeRoles('superviseur'), controller.update_reclamation);
router.delete('/reclamations/:id', authenticateToken, authorizeRoles('superviseur'), controller.delete_reclamation);
router.get('/reclamations/:id', authenticateToken, authorizeRoles('superviseur'), controller.get_reclamation_by_id);
router.get('/essentielles', authenticateToken, authorizeRoles('admin', 'superviseur'), get_reclamations_essentielles);
router.get('/motifs', authenticateToken, authorizeRoles('admin', 'superviseur'), get_motifs);
router.get('/reclamations/stats/mois', authenticateToken, authorizeRoles('admin'), controller.get_reclamations_stats_by_month);
router.get('/reclamations/stats/superviseur', authenticateToken, authorizeRoles('admin'), controller.get_reclamations_stats_by_superviseur);

module.exports = router;
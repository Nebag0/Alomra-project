const { Router } = require('express');
const controller = require('../controllers/Users_controller'); 
const authenticateToken = require('../middleware/auth');

const router = Router();

// Routes accessibles à tous les utilisateurs connectés
router.get('/', authenticateToken, controller.get_my_profile);
router.post('/motdepasse', authenticateToken, controller.change_password);
router.put('/', authenticateToken, controller.update_my_profile);

module.exports = router; 
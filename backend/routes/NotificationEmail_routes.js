const express = require('express');
const router = express.Router();
const controller = require('../controllers/NotificationEmail_controller');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authRole');

// Toutes les routes sont protégées et réservées à l'admin
router.get('/', authenticateToken, authorizeRoles('admin'), controller.get_notification_emails);
router.post('/', authenticateToken, authorizeRoles('admin'), controller.add_notification_email);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), controller.delete_notification_email);

module.exports = router; 
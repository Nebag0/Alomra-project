const { Router } = require('express');
const authController = require('../controllers/Users_controller'); 

const router = Router();


// Route to get user data
router.get('/getUsers', authController.get_user);
// Route to get user by ID
router.get('/getUser/:id', authController.get_user_by_id);
// Route to create a new user
router.post('/createUser', authController.create_user);

module.exports = router;
const { Router } = require('express');
const controller = require('../controllers/Users_controller'); 
const authenticateToken = require('../middleware/auth');

const router = Router();


router.get('/getUsers', authenticateToken, controller.get_users);
router.get('/getUser/:id', authenticateToken, controller.get_user_by_id);
router.put('/updateUser/:id', authenticateToken, controller.update_user);
router.delete('/deleteUser/:id', authenticateToken, controller.delete_user);

//ceux-ci ne contient pas de token 
router.post('/createUser', controller.create_user);
router.post('/login', controller.login);

module.exports = router;
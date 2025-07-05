const { Router } = require('express');
const controller = require('../controllers/Users_controller'); 
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authRole');
const reclamationController = require('../controllers/Reclamation_controller');


const router = Router();


router.get('/getUsers', authenticateToken, authorizeRoles('admin'), controller.get_users);
router.get('/getUser/:id', authenticateToken, authorizeRoles('admin'), controller.get_user_by_id);
router.put('/updateUser/:id', authenticateToken, authorizeRoles('admin'), controller.update_user);
router.delete('/deleteUser/:id', authenticateToken, authorizeRoles('admin'), controller.delete_user);
router.delete('/deleteUserSecure/:id', authenticateToken, authorizeRoles('admin'), controller.delete_user_secure);

//ceux-ci ne contient pas de token 
router.post('/createUser', controller.create_user); 
router.post('/login', controller.login);
router.get('/profil', authenticateToken, controller.get_my_profile);

router.get('/reclamations', authenticateToken, authorizeRoles('admin'), reclamationController.get_all_reclamations);
router.get('/reclamations/:id', authenticateToken, authorizeRoles('admin'), reclamationController.get_reclamation_by_id);


module.exports = router;
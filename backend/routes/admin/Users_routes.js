const { Router } = require('express');
const controller = require('../../controllers/admin/Users_controller'); 

const router = Router();


router.get('/getUsers', controller.get_users);
router.get('/getUser/:id', controller.get_user_by_id);
router.post('/createUser', controller.create_user);
router.put('/updateUser/:id', controller.update_user);
router.delete('/deleteUser/:id', controller.delete_user);

module.exports = router;
const Router = require('express')
const router = new Router
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/registration', userController.registration)  // регестрация 
router.post('/login', userController.login) // вход 

router.use(authMiddleware);

router.post('/auth', userController.check) // аунтификация  
router.get('/profile', userController.getProfile)  //получение 
router.patch('/profile', userController.updateProfile) // обновление 
router.delete('/profile', userController.deleteProfile) // удаление


module.exports = router


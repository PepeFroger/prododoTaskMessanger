const Router = require('express');
const router = new Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware); 

router.post('/', taskController.createTask);
router.get('/analytics', taskController.getAnalytics);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
//Аналитика


module.exports = router;
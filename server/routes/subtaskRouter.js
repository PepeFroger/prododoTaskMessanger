const Router = require('express')
const router = new Router
const subtaskController = require('../controllers/subtaskController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.post('/:taskId', subtaskController.createSubtask)
router.get('/:taskId', subtaskController.getAllSubtasks)
router.patch('/:id', subtaskController.updateSubtask)
router.delete('/:id', subtaskController.deleteSubtask)

module.exports = router
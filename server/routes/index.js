const Router = require('express')
const router = new Router
const userRouter = require('./userRouter')
const friendRouter = require('./friendRouter')
const taskRouter = require('./taskRouter')
const subtaskRouter = require('./subtaskRouter')


router.use('/user', userRouter)
router.use('/friend', friendRouter)
router.use('/task', taskRouter)
router.use('/subtask', subtaskRouter)

module.exports = router
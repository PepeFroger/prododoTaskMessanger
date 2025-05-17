const Router = require('express');
const router = new Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/requests/', friendController.sendFriendRequest);
router.get('/requests', friendController.getFriendRequests);
router.get('/analytics/:friendId', friendController.getFriendAnalytics);
router.patch('/requests/:id', friendController.respondToRequests);
router.get('/', friendController.getFriendList);
router.delete('/:friendId', friendController.removeFriend);

module.exports = router;
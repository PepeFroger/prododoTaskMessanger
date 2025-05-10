const friendService = require('../services/friendService');
const ApiError = require('../error/ApiError')

class FriendController {
    async sendFriendRequest(req, res, next) {
        try {
            const { userId } = req.params;
            const currentUserId = req.user.id;
            const request = await friendService.sendFriendRequest(currentUserId, userId);
            res.status(201).json(request);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getFriendRequests(req, res, next) {
        try {
            const currentUserId = req.user.id;
            const requests = await friendService.getFriendRequests(currentUserId);
            res.json(requests);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async respondToRequests(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const currentUserId = req.user.id;
            const request = await friendService.respondToRequest(currentUserId, id, status);
            res.json(request);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getFriendList(req, res, next) {
        try {
            const currentUserId = req.user.id;
            const friends = await friendService.getFriendsList(currentUserId);
            res.json(friends);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async removeFriend(req, res, next) {
        try {
            const { friendId } = req.params;
            const currentUserId = req.user.id;
            await friendService.removeFriend(currentUserId, friendId);
            res.json({ success: true });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new FriendController();
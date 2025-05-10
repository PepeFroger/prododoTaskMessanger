const friendRepository = require('../repositories/friendRepository');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../error/ApiError');

class FriendService {
    async sendFriendRequest(userId, friendId) {
        if (userId === friendId) {
            throw ApiError.BadRequest('Cannot send request to yourself');
        }

        const friend = await userRepository.findById(friendId);
        if (!friend) {
            throw ApiError.NotFound('User not found');
        }

        const existingRequest = await friendRepository.findFriendRelation(userId, friendId);
        if (existingRequest) {
            throw ApiError.BadRequest('Friend request already exists');
        }

        return await friendRepository.createFriendRequest(userId, friendId);
    }

    async getFriendRequests(userId) {
        return await friendRepository.getFriendRequests(userId);
    }

    async respondToRequest(userId, requestId, status) {
        const request = await friendRepository.findFriendRequest(requestId);
        if (!request || request.friendId !== userId) {
            throw ApiError.NotFound('Request not found or access denied');
        }

        if (request.status !== 'pending') {
            throw ApiError.BadRequest('Request already processed');
        }

        if (!['accepted', 'rejected'].includes(status)) {
            throw ApiError.BadRequest('Invalid status');
        }

        return await friendRepository.updateFriendRequest(requestId, status);
    }

    async getFriendsList(userId) {
        return await friendRepository.getFriendsList(userId);
    }

    async removeFriend(userId, friendId) {
        const relation = await friendRepository.findFriendRelation(userId, friendId);
        if (!relation) {
            throw ApiError.NotFound('Friend relation not found');
        }

        if (relation.status !== 'accepted') {
            throw ApiError.BadRequest('Only accepted friends can be removed');
        }

        await friendRepository.deleteFriendRequest(relation.id);
        return { success: true };
    }
}

module.exports = new FriendService();
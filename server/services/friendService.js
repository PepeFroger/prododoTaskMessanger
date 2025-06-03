const friendRepository = require('../repositories/friendRepository');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../error/ApiError');
const taskService = require('./taskService')

class FriendService {
    async sendFriendRequestByEmail(userId, email) {
    if (!email) {
        throw ApiError.badRequest('Email is required');
    }

    // Находим пользователя по email
    const friend = await userRepository.findByEmail(email);
    if (!friend) {
        throw ApiError.badRequest('User with this email not found');
    }

    const friendId = friend.id;

    // Остальная логика остается как была
    if (userId === friendId) {
        throw ApiError.badRequest('Cannot send request to yourself');
    }

    const existingRelation = await friendRepository.findFriendRelation(userId, friendId);
    if (existingRelation) {
        if (existingRelation.status === 'pending') {
            if (existingRelation.friendId === userId) {
                return await friendRepository.updateFriendRequest(existingRelation.id, 'accepted');
            }
            throw ApiError.badRequest('Friend request already exists');
        }
        if (existingRelation.status === 'accepted') {
            throw ApiError.badRequest('You are already friends');
        }
    }

    return await friendRepository.createFriendRequest(userId, friendId);
}

    async getFriendRequests(userId) {
    const requests = await friendRepository.getFriendRequests(userId);
    
    // Добавляем информацию об отправителе
    return Promise.all(requests.map(async request => {
        const sender = await userRepository.findById(request.userId);
        return {
            id: request.id,
            status: request.status,
            createdAt: request.createdAt,
            sender: {
                id: sender.id,
                name: sender.name,
                email: sender.email
            }
        };
    }));
}

    async respondToRequest(userId, requestId, status) {
        const request = await friendRepository.findFriendRequest(requestId);
        if (!request || request.friendId !== userId) {
            throw ApiError.badRequest('Request not found or access denied');
        }

        if (request.status !== 'pending') {
            throw ApiError.badRequest('Request already processed');
        }

        if (!['accepted', 'rejected'].includes(status)) {
            throw ApiError.badRequest('Invalid status');
        }

        return await friendRepository.updateFriendRequest(requestId, status);
    }

    async getFriendsList(userId) {
        return await friendRepository.getFriendsList(userId);
    }

    async removeFriend(userId, friendId) {
        const relation = await friendRepository.findFriendRelation(userId, friendId);
        if (!relation) {
            throw ApiError.badRequest('Friend relation not found');
        }

        if (relation.status !== 'accepted') {
            throw ApiError.badRequest('Only accepted friends can be removed');
        }

        await friendRepository.deleteFriendRequest(relation.id);
        return { success: true };
    }

    async getFriendAnalytics(userId, friendId) {
        // 1. Проверяем дружеские отношения
        const isFriend = await friendRepository.findFriendRelation(userId, friendId);
        if (!isFriend || isFriend.status !== 'accepted') {
            throw ApiError.badRequest('User is not your friend');
        }

        // 2. Получаем данные друга
        const friend = await userRepository.findById(friendId);
        if (!friend) {
            throw ApiError.badRequest('Friend not found');
        }

        // 3. Используем taskService для получения аналитики
        const analytics = await taskService.getFullAnalytics(friendId);
        
        return {
            friend: {
                id: friend.id,
                name: friend.name,
                email: friend.email
            },
            tasks: analytics.summary,
            subtasks: analytics.subtasks,
            trends: analytics.trends,
            updatedAt: analytics.updatedAt
        };
    }
}

module.exports = new FriendService();
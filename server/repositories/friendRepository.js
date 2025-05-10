const { Friend, User } = require('../models/models');

class FriendRepository {
    async createFriendRequest(userId, friendId) {
        return await Friend.create({
            userId,
            friendId,
            status: 'pending'
        });
    }

    async findFriendRequest(id) {
        return await Friend.findByPk(id);
    }

    async updateFriendRequest(id, status) {
        const request = await Friend.findByPk(id);
        if (!request) return null;
        return await request.update({ status });
    }

    async deleteFriendRequest(id) {
        const request = await Friend.findByPk(id);
        if (!request) return null;
        await request.destroy();
        return true;
    }

    async getFriendRequests(userId) {
        return await Friend.findAll({
            where: { friendId: userId, status: 'pending' },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }]
        });
    }

    async getFriendsList(userId) {
        return await Friend.findAll({
            where: {
                [Op.or]: [
                    { userId, status: 'accepted' },
                    { friendId: userId, status: 'accepted' }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                    where: { id: { [Op.ne]: userId } }
                },
                {
                    model: User,
                    as: 'friend',
                    attributes: ['id', 'name', 'email'],
                    where: { id: { [Op.ne]: userId } }
                }
            ]
        });
    }

    async findFriendRelation(userId, friendId) {
        return await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId }
                ]
            }
        });
    }
}

module.exports = new FriendRepository();
const { Friend, User } = require('../models/models');
const { Op } = require('sequelize');

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
        where: { 
            friendId: userId,
            status: 'pending'
        },
        order: [['createdAt', 'DESC']]
    });
}

    async getFriendsList(userId) {
    // Получаем все подтвержденные дружеские связи
    const relations = await Friend.findAll({
        where: {
            status: 'accepted',
            [Op.or]: [
                { userId: userId },
                { friendId: userId }
            ]
        }
    });

    // Собираем ID всех друзей
    const friendIds = relations.map(relation => 
        relation.userId === userId ? relation.friendId : relation.userId
    );

    // Получаем полную информацию о друзьях
    return await User.findAll({
        where: {
            id: {
                [Op.in]: friendIds
            }
        },
        attributes: ['id', 'name', 'email']
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
const taskRepository = require('../repositories/taskRepository');
const analyticRepository = require('../repositories/analyticRepository');
const ApiError = require('../error/ApiError');

class TaskService {
    async create(userId, taskData) {
        if (!taskData.name) {
            throw ApiError.badRequest('Имя задачи не найдено');
        }
        const task = await taskRepository.create({...taskData, userId});
        await this._updateAnalytics(userId);
        return task;
    }

    async updateTask(userId, taskId, updateData) {
        const updated = await taskRepository.update(taskId, updateData, {
            where: { userId }
        });
        if (!updated) throw ApiError.badRequest('Task not found or access denied');
        
        if ('isCompleted' in updateData) {
            await this._updateAnalytics(userId);
        }
        return updated;
    }

    async deleteTask(userId, taskId) {
        const deleted = await taskRepository.delete(taskId, {
            where: { userId }
        });
        if (!deleted) throw ApiError.badRequest('Task not found or access denied');
        await this._updateAnalytics(userId);
        return deleted;
    }

    async _updateAnalytics(userId) {
        const [total, completed] = await Promise.all([
            taskRepository.count({ where: { userId } }),
            taskRepository.count({ where: { userId, isCompleted: true } })
        ]);

        return analyticRepository.createOrUpdate({
            userId,
            totalTasks: total,
            completedTasks: completed,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        });
    }

    async getTaskAnalytics(userId) {
        let analytics = await analyticRepository.findByUserId(userId);
        
        if (!analytics) {
            analytics = await this._updateAnalytics(userId);
        }
        
        return analytics;
    }
}

module.exports = new TaskService();
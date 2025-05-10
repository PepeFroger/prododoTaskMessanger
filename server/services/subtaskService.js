const subtaskRepository = require('../repositories/subtaskRepository')
const taskRepository = require('../repositories/taskRepository')
const ApiError = require('../error/ApiError')


class SubtaskService{
	async createSubtask(taskId, name, userId){
		if (!name) throw ApiError.badRequest('Имя потеряно')
		
		const task = await taskRepository.findById(taskId)
		if (!task || task.userId !== userId){
			throw ApiError.badRequest('Задача не найдена')
		}

		return await subtaskRepository.create({
			name,
			taskId,
			userId
		})
	}
	async getSubtasksByTask(taskId, userId) {
        // Проверяем существование задачи и доступ
        const task = await taskRepository.findById(taskId);
        if (!task || task.userId !== userId) {
            throw ApiError.NotFound('Task not found or access denied');
        }

        return await subtaskRepository.findAllByTaskId(taskId);
    }

    async updateSubtask(id, updateData, userId) {
        await this._checkSubtaskAccess(id, userId);
        return await subtaskRepository.update(id, updateData);
    }

    async deleteSubtask(id, userId) {
        await this._checkSubtaskAccess(id, userId);
        await subtaskRepository.delete(id);
        return { success: true };
    }

    async _checkSubtaskAccess(id, userId) {
        const subtask = await subtaskRepository.findById(id);
        if (!subtask) throw ApiError.NotFound('Subtask not found');
        if (subtask.userId !== userId) throw ApiError.Forbidden('No access');
        return subtask;
    }
}

module.exports = new SubtaskService()


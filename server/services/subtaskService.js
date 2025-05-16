const subtaskRepository = require('../repositories/subtaskRepository');
const taskRepository = require('../repositories/taskRepository');
const ApiError = require('../error/ApiError');

class SubtaskService {
  async createSubtask(taskId, name, userId) {
    if (!name || name.length < 2) {
      throw ApiError.badRequest('Название подзадачи должно содержать минимум 2 символа');
    }

    await this._verifyTaskAccess(taskId, userId);
    return subtaskRepository.create({ name, taskId });
  }

  async getSubtasksByTask(taskId, userId) {
    await this._verifyTaskAccess(taskId, userId);
    return subtaskRepository.findAllByTaskId(taskId);
  }

  async updateSubtask(id, updateData, userId) {
    await this._verifySubtaskAccess(id, userId);
    return subtaskRepository.update(id, updateData);
  }

  async deleteSubtask(id, userId) {
    await this._verifySubtaskAccess(id, userId);
    return subtaskRepository.delete(id);
  }

  async _verifyTaskAccess(taskId, userId) {
    const task = await taskRepository.findById(taskId);
    if (!task || task.userId !== userId) {
      throw ApiError.forbidden('Нет доступа к задаче');
    }
    return task;
  }

  async _verifySubtaskAccess(subtaskId, userId) {
    const subtask = await subtaskRepository.findById(subtaskId);
    if (!subtask) throw ApiError.notFound('Подзадача не найдена');
    
    const task = await taskRepository.findById(subtask.taskId);
    if (!task || task.userId !== userId) {
      throw ApiError.forbidden('Нет доступа к подзадаче');
    }
    
    return subtask;
  }
}

module.exports = new SubtaskService();
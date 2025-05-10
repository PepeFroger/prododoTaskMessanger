const taskRepository = require('../repositories/taskRepository')
const ApiError = require('../error/ApiError')

class TaskService{
	async create(userId, taskData){
		if(!taskData.name){
			throw ApiError.badRequest('Имя зщадачи не найдено')
		}
		return taskRepository.create({...taskData, userId})
	}

	async getTask(userId, taskId) {
    const task = await taskRepository.findById(taskId);
        if (!task || task.userId !== userId) {
            throw ApiError.NotFound('Task not found');
        }
        return task;
  }

	async getAllUserTasks(userId, filters = {}) {
    return taskRepository.findAll({
      where: { userId, ...filters },
      attributes: ['id', 'name', 'dateDeadline', 'isCompleted'],
      order: [['dateDeadline', 'ASC']]
    });
  }


  async updateTask(userId, taskId, updateData) {
    const updated = await taskRepository.update(taskId, updateData, {
      where: { userId }
    });
    if (!updated) throw ApiError.badRequest('Task not found or access denied');
    return updated;
  }


  async deleteTask(userId, taskId) {
    const deleted = await taskRepository.delete(taskId, {
      where: { userId }
    });
    if (!deleted) throw ApiError.badRequest('Task not found or access denied');
    return deleted;
  }


  async getTaskAnalytics(userId) {
    const total = await taskRepository.count({ userId });
    const completed = await taskRepository.count({ 
      where: { 
        userId,
        isCompleted: true 
      }
    });
    
    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
}





module.exports = new TaskService()
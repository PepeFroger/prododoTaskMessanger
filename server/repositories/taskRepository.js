const { Task } = require('../models/models');
const ApiError = require('../error/ApiError');

class TaskRepository {
  async create(data) {
    return Task.create(data);
  }

  async findById(id) {
    return Task.findByPk(id, {
      include: ['Subtasks']
    });
  }

  async findAll(options = {}) {
    const finalOptions = {
      include: options.include || ['Subtasks'],
      paranoid: options.paranoid !== false,
      ...options
    };
    return Task.findAll(finalOptions);
  }

  async update(id, data) {
    const task = await Task.findByPk(id);
    if (!task) throw ApiError.notFound('Task not found');
    return task.update(data);
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) throw ApiError.notFound('Task not found');
    return task.destroy();
  }
}

module.exports = new TaskRepository();
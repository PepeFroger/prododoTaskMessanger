const taskRepository = require('../repositories/taskRepository');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class TaskService {
  async create(taskData) {
    if (!taskData?.name || taskData.name.length < 2) {
      throw ApiError.badRequest('Название задачи должно содержать минимум 2 символа');
    }
    
    return taskRepository.create({
      name: taskData.name,
      description: taskData.description,
      timeDeadline: taskData.timeDeadline,
      dateDeadline: taskData.dateDeadline,
      userId: taskData.userId
    });
  }

  async getAllUserTasks(userId, filters = {}) {
    const options = {
      where: { userId },
      include: ['Subtasks'],
      paranoid: filters.includeDeleted ? false : true
    };

    if (filters.isCompleted !== undefined) {
      options.where.isCompleted = filters.isCompleted;
    }

    if (filters.startDate || filters.endDate) {
      options.where.createdAt = {
        [Op.between]: [
          filters.startDate ? new Date(filters.startDate) : new Date(0),
          filters.endDate ? new Date(filters.endDate) : new Date()
        ]
      };
    }

    return taskRepository.findAll(options);
  }

  async getTask(userId, taskId) {
    const task = await taskRepository.findById(taskId);
    if (!task || task.userId !== userId) {
      throw ApiError.forbidden('Задача не найдена или нет доступа');
    }
    return task;
  }

  async updateTask(userId, taskId, updateData) {
    await this.getTask(userId, taskId); // Проверка доступа
    return taskRepository.update(taskId, updateData);
  }

  async deleteTask(userId, taskId) {
    await this.getTask(userId, taskId); // Проверка доступа
    return taskRepository.delete(taskId);
  }

  async getFullAnalytics(userId, dateFilters = {}) {
    const tasks = await this.getAllUserTasks(userId, {
      ...dateFilters,
      includeDeleted: true
    });

    const now = new Date();
    const stats = {
      summary: this._calculateTaskStats(tasks, now),
      subtasks: this._calculateSubtaskStats(tasks),
      trends: this._calculateCompletionTrends(tasks),
      updatedAt: now.toISOString()
    };

    return stats;
  }

  _calculateTaskStats(tasks, now) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const overdue = tasks.filter(t => 
      !t.isCompleted && t.dateDeadline && new Date(t.dateDeadline) < now
    ).length;

    return {
      total,
      completed,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      ...this._calculateCompletionTime(tasks)
    };
  }

  _calculateSubtaskStats(tasks) {
    const stats = tasks.reduce((acc, task) => {
      const subtasks = task.Subtasks || [];
      acc.total += subtasks.length;
      acc.completed += subtasks.filter(st => st.isCompleted).length;
      return acc;
    }, { total: 0, completed: 0 });

    return {
      ...stats,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    };
  }

  _calculateCompletionTime(tasks) {
    const completedTasks = tasks.filter(t => t.isCompleted && t.createdAt && t.updatedAt);
    if (completedTasks.length === 0) return { avgCompletionDays: null };

    const totalMs = completedTasks.reduce((sum, task) => {
      return sum + (new Date(task.updatedAt) - new Date(task.createdAt));
    }, 0);

    return {
      avgCompletionDays: Math.round(totalMs / completedTasks.length / (1000 * 60 * 60 * 24)),
      fastestCompletion: Math.min(...completedTasks.map(t => 
        Math.round((new Date(t.updatedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24))
      )),
      slowestCompletion: Math.max(...completedTasks.map(t => 
        Math.round((new Date(t.updatedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24))
      ))
    };
  }

  _calculateCompletionTrends(tasks) {
    const monthlyStats = {};
    tasks.forEach(task => {
      const monthYear = task.createdAt.toISOString().slice(0, 7);
      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = { total: 0, completed: 0 };
      }
      monthlyStats[monthYear].total++;
      if (task.isCompleted) monthlyStats[monthYear].completed++;
    });

    return Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      ...stats,
      completionRate: Math.round((stats.completed / stats.total) * 100) || 0
    }));
  }
}

module.exports = new TaskService();
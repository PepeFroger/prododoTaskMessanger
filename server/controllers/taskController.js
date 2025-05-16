const taskService = require('../services/taskService');
const ApiError = require('../error/ApiError');

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = await taskService.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(task);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllTasks(req, res, next) {
    try {
      const tasks = await taskService.getAllUserTasks(req.user.id, req.query);
      res.json(tasks);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await taskService.getTask(req.user.id, parseInt(req.params.id));
      res.json(task);
    } catch (e) {
      next(e);
    }
  }

  async updateTask(req, res, next) {
    try {
      await taskService.updateTask(req.user.id, parseInt(req.params.id), req.body);
      res.status(204).end();
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.user.id, parseInt(req.params.id));
      res.status(204).end();
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await taskService.getFullAnalytics(req.user.id, {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      });
      res.json(analytics);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new TaskController();
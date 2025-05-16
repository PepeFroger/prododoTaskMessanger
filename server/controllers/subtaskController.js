const subtaskService = require('../services/subtaskService')
const ApiError = require('../error/ApiError')

class SubtaskController {
  async createSubtask(req, res, next) {
    try {
      const subtask = await subtaskService.createSubtask(
        req.params.taskId,
        req.body.name,
        req.user.id
      )
      res.status(201).json(subtask)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAllSubtasks(req, res, next) {
    try {
      const subtasks = await subtaskService.getSubtasksByTask(
        req.params.taskId,
        req.user.id
      )
      res.json(subtasks)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async updateSubtask(req, res, next) {
    try {
      const subtask = await subtaskService.updateSubtask(
        req.params.id,
        req.body,
        req.user.id
      )
      res.json(subtask)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async deleteSubtask(req, res, next) {
    try {
      await subtaskService.deleteSubtask(req.params.id, req.user.id)
      res.status(204).end()
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new SubtaskController()
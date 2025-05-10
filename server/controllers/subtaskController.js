const ApiError = require('../error/ApiError');
const subtaskService = require('../services/subtaskService');


class SubtaskController {
    async createSubtask(req, res, next) {
        try {
            const { name } = req.body;
            const { taskId } = req.params;
            const userId = req.user.id;

            const subtask = await subtaskService.createSubtask(taskId, name, userId);
            res.status(201).json(subtask);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllSubtask(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user.id;

            const subtasks = await subtaskService.getSubtasksByTask(taskId, userId);
            res.json(subtasks);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateSubtask(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = req.user.id;

            const subtask = await subtaskService.updateSubtask(id, updateData, userId);
            res.json(subtask);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteSubtask(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await subtaskService.deleteSubtask(id, userId);
            res.json({ success: true });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new SubtaskController();
const ApiError = require("../error/ApiError")
const taskService = require("../services/taskService")



class TaskController{
	async createTask(req,res, next){
		try{
			const task = await taskService.create(req.user.id, req.body)
			res.status(201).json(task)
		}catch(e){
			next(ApiError.badRequest(e.message))
		}
	}

	async getAllTasks(req, res, next) {
    try {
      const tasks = await taskService.getAllUserTasks(
        req.user.id,
        req.query 
      );
      res.json(tasks);
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
  }

	async getTask(req, res, next) {
    try {
      const task = await taskService.getTask(
        req.user.id,
        req.params.id
      );
      res.json(task);
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
  }

	 async updateTask(req, res, next) {
    try {
      await taskService.updateTask(
        req.user.id,
        req.params.id,
        req.body
      );
      res.status(204).end();
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
  }

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.user.id, req.params.id);
      res.status(204).end();
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await taskService.getTaskAnalytics(req.user.id);
      res.json(analytics);
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
  }
}


module.exports = new TaskController()
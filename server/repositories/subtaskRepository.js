const { Subtask } = require('../models/models')

class SubtaskRepository{
	async create(subtaskData){
		return await Subtask.create(subtaskData)
	}

	async findAllByTaskId(taskId){
		return await Subtask.findAll({where: {taskId}})

	}

	async findById(id){
		return await Subtask.findByPk(id)
	}

	async update(id, updateData){
		const subtask = await Subtask.findByPk(id)
		if (!subtask) return null
		return await subtask.update(updateData)
	}

	async destroy(id){
		const subtask = await Subtask.findByPk(id)
		if (!subtask) return null
		await subtask.destroy()
		return true
	}

}

module.exports = new SubtaskRepository()
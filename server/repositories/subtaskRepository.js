const { Subtask } = require('../models/models')

class SubtaskRepository {
  async create(subtaskData) {
    return Subtask.create(subtaskData)
  }

  async findAllByTaskId(taskId) {
    return Subtask.findAll({ where: { taskId } })
  }

  async findById(id) {
    return Subtask.findByPk(id)
  }

  async update(id, updateData) {
    const subtask = await Subtask.findByPk(id)
    if (!subtask) return null
    return subtask.update(updateData)
  }

  async delete(id) {
    const subtask = await Subtask.findByPk(id)
    if (!subtask) return null
    await subtask.destroy()
    return true
  }
}

module.exports = new SubtaskRepository()
const { Task } = require('../models/models')


class TaskRepository {

  async create(data) {
    return Task.create(data);
  }


  async findById(id, options = {}) {
    return Task.findByPk(id, options);
  }

  async findAll(options = {}) {
    return Task.findAll(options);
  }


  async update(id, data, options = {}) {
    const [affectedRows] = await Task.update(data, { 
      where: { id },
      ...options
    });
    return affectedRows > 0;
  }


  async delete(id, options = {}) {
    return Task.destroy({ 
      where: { id },
      ...options
    });
  }


  async count(where = {}) {
    return Task.count({ where });
  }
}

module.exports = new TaskRepository();
const { TaskAnalytics } = require('../models/models')

class AnalyticRepository{
  async findByUserId(userId) {
    return TaskAnalytics.findOne({ where: { userId } })
  }

async createOrUpdate(data) {
  if (!data.userId) {
    throw new Error('userId is required');
  }

  const [analytic, created] = await TaskAnalytics.findOrCreate({
    where: { userId: data.userId },
    defaults: data
  });

  if (!created) {
    await analytic.update(data);
  }

  return analytic;
}
}

module.exports = new AnalyticRepository()
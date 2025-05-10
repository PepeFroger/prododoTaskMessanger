const { TaskAnalytics } = require('../models/models')

class AnalyticRepository{
	async findByUserId(userId){
		return await TaskAnalytics.findOne({where: {userId}})
	}
	async createOrUpdate(data) {
        const [analytic, created] = await TaskAnalytics.findOrCreate({
            where: { userId: data.userId },
            defaults: data
        });
        
        if (!created) {
            return await analytic.update(data);
        }
        return analytic;
    }
}

module.exports = new AnalyticRepository()
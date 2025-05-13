const { User } = require('../models/models')
const ApiError = require('../error/ApiError')

class UserRepository{
	async findByEmail(email){
		return User.findOne({where: {email} })
	}

	async create({name, email, password}){
		return User.create({name, email, password})
	}
	async findById(id){
		return User.findByPk(id)
	}

	async update(id, updateData){
		const user = await User.findByPk(id)
		if (!user) throw ApiError.badRequest('Пользователь не найден')
		return user.update(updateData)
	}

	async delete(id){
		const user = await User.findByPk(id)
		if (!user) throw ApiError.badRequest('Пользователь не найден')
		return user.destroy()
	}
}


module.exports = new UserRepository()
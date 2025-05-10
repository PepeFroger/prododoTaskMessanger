const userRepository = require('../repositories/userRepository')
const jwt = require('../utils/jwt')
const ApiError = require('../error/ApiError')

class UserService{
	async registration(email, name, password){
		const existingUser = await userRepository.findByEmail(email)
		if (existingUser){
			throw ApiError.badRequest('Email зарегестрирован')
		}
		return userRepository.create({name, email, password})
	}

	async login(email, password){
		const user = await userRepository.findByEmail(email)
		if (!user || !user.comparePassword(password)){
			throw ApiError.badRequest('Некоректный пароль')
		}

		const token = jwt.generateToken({
			id: user.id,
			email: user.email,
			role: user.role
		})
		return {user: user.get(), token}
	}

	async getProfile(userId){
		return userRepository.findById(userId)
	}

	async updateProfile(userId, updateData){
		if (updateData.password){
			updateData.password = bcrypt.hashSync(updateData.password, 10)
		}
		return userRepository.update(userId, updateData)
	}
	async deleteProfile(userId){
		return userRepository.delete(userId)
	}
}


module.exports = new UserService()

const userRepository = require('../repositories/userRepository')
const jwt = require('../utils/jwt')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')

class UserService{
async registration(name, email, password) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw ApiError.badRequest('Email уже зарегистрирован');
  }
  
  // Хеширование теперь происходит в beforeCreate хуке
  return userRepository.create({ name, email, password });
}

	async login(email, password){
		const user = await userRepository.findByEmail(email)
		if (!user || !user.comparePassword(password)){
			throw ApiError.badRequest('Некоректный пароль')
		}

		const token = jwt.generateToken(
			user.id,
			user.email,
			user.role
		)
		return {user: {id: user.id, email: user.email, role: user.role}, token}
	}

	async getProfile(userId){
		return userRepository.findById(userId)
	}

	async updateProfile(userId, updateData) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('Пользователь не найден');
  }
  
  // Пароль теперь хешируется в хуке модели
  return user.update(updateData);
}

	
	async deleteProfile(userId){
		return userRepository.delete(userId)
	}
}


module.exports = new UserService()

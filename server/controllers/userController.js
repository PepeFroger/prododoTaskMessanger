const userService = require('../services/userService')
const ApiError = require('../error/ApiError')

class UserController{
	async registration(req,res, next){
		try{
			const { name, email, password } = req.body
      await userService.registration(name, email, password)
      res.status(201).json({ message: 'Registration successful' })
		}catch(e){
			next(ApiError.badRequest(e.message))
		}
	}
	async login(req,res, next){
		try {
      const { email, password } = req.body
      const { user, token } = await userService.login(email, password)
      res.json({ user, token })
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
	}

	async getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id); // Используем ID из токена
    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'));
    }
    res.json(user);
  } catch (e) {
    next(ApiError.badRequest(e.message));
  }
}
async updateProfile(req, res, next) {
  try {
    // Убедимся, что есть данные для обновления
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(ApiError.badRequest('Нет данных для обновления'));
    }
    
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.json(updatedUser);
  } catch (e) {
    next(ApiError.internal(e.message));
  }
}
	async deleteProfile(req,res, next){
		try {
      await userService.deleteProfile(req.user.id)
      res.json({ message: 'User deleted successfully' })
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
	}
}

module.exports = new UserController()
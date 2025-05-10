const userService = require('../services/userService')
const ApiError = require('../error/ApiError')

class UserController{
	async registration(req,res, next){
		try{
			const { name, email, password } = req.body
      await userService.register(name, email, password)
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
	async check(req,res, next){
		    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] } 
      })
      if (!user) {
        throw ApiError.Unauthorized('Пользователь не найден')
      }
      res.json(user)
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
	}
	async getProfile(req,res, next){
		 try {
      const user = await userService.getProfile(req.user.id)
      res.json(user)
    } catch (e) {
			next(ApiError.badRequest(e.message))
    }
	}
	async updateProfile(req,res, next){
		 try {
      const updatedUser = await userService.updateProfile(req.user.id, req.body)
      res.json(updatedUser)
    } catch (e) {
			next(ApiError.badRequest(e.message))
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
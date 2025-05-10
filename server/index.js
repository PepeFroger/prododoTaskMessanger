require('dotenv').config()
const express = require('express')
const cors = require("cors")
const sequelize = require('./db')
const router = require('./routes/index')
const models = require('./models/models')
const errorHaadler = require('./middleware/ErrorHandlingMiddleware')


const PORT = process.env.PORT || 6000

const app = express()


app.use(cors())
app.use(express.json())
app.use('/api', router)


app.use(errorHaadler)


const start = async () => {
	try{
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, ()=> console.log(`Server on port ${PORT}`));
	} catch (e){
		console.log(e)
	}
}

start()
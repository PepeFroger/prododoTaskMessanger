require('dotenv').config()
const express = require('express')
const cors = require("cors")
const sequelize = require('./db')
const router = require('./routes/index')
const models = require('./models/models')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')


const PORT = process.env.PORT || 6000;
const app = express();

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS и обработка данных

app.use(cors());
app.use(express.json());

// Роуты
app.use('/api', router);

// Обработка ошибок
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error('Server error:', e);
  }
};

start();
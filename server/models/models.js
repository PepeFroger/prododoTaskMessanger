const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true }},
  password: {type: DataTypes.STRING, allowNull: false},
  role: {type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER'}
}, {
  hooks: {
    beforeValidate: (user) => {
      if (user.password && user.password.length < 8) {
        throw new Error('Пароль должен содержать минимум 8 символов');
      }
    },
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

const Task = sequelize.define('task', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING},
  timeDeadline: {type: DataTypes.TIME},
  dateDeadline: {type: DataTypes.DATEONLY},
  isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
  timestamps: true,
  paranoid: true
});

const Subtask = sequelize.define('subtask', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false}
});

const Friend = sequelize.define('friend', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  status: {type: DataTypes.STRING, defaultValue: 'pending'}
});

// Методы пользователя
User.prototype.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

// Связи
User.hasMany(Task);
Task.belongsTo(User);

Task.hasMany(Subtask, {
  as: 'Subtasks',
  foreignKey: 'taskId',
  onDelete: 'CASCADE'
});
Subtask.belongsTo(Task);

User.belongsToMany(User, {
  through: Friend,
  as: 'friends',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

User.belongsToMany(User, {
  through: Friend,
  as: 'friendOf',
  foreignKey: 'friendId',
  otherKey: 'userId'
});

module.exports = {
  User,
  Friend,
  Task,
  Subtask
};
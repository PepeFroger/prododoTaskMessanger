const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true }},
  password: {type: DataTypes.STRING, allowNull: false,},
	role: {type: DataTypes.ENUM('USER', 'ADMIN'),defaultValue: 'USER'}
}, 
{
  timestamps: true,
  paranoid: false,
  hooks: {
		beforeValidate: (user) => {
    if (user.password && user.password.length < 8) {
      throw new Error('Пароль должен содержать минимум 8 символов');}},
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);}},
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);}}
}});


User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Task = sequelize.define('task', {
	id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	name:{type: DataTypes.STRING, allowNull: false},
	description:{type: DataTypes.STRING,},
	timeDeadline: {type: DataTypes.TIME, },
	dateDeadline:{type: DataTypes.DATEONLY,},
	isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false},
	completedSubtask: {type: DataTypes.INTEGER, defaultValue: 0},
	totalSubtask: {type: DataTypes.INTEGER, defaultValue: 0},
},
{
  timestamps: true,
  paranoid: true 
})

Task.afterCreate(async (task) => {
  const service = require('../services/taskService');
  await service._updateAnalytics(task.userId);
});

Task.afterUpdate(async (task) => {
  if (task.changed('isCompleted')) {
    const service = require('../services/taskService');
    await service._updateAnalytics(task.userId);
  }
});

Task.afterDestroy(async (task) => {
  const service = require('../services/taskService');
  await service._updateAnalytics(task.userId);
});


const Subtask = sequelize.define('subtask', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
	name:{type: DataTypes.STRING, allowNull: false},
	isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const TaskAnalytics = sequelize.define('taskAnalytics', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userId: { type: DataTypes.INTEGER, allowNull: false,unique: true},
	totalTasks: { type: DataTypes.INTEGER, defaultValue: 0 },
	completedTasks: { type: DataTypes.INTEGER, defaultValue: 0 },
	completionRate: { type: DataTypes.FLOAT, defaultValue: 0 },
	lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
	timestamps: false
})



const Friend = sequelize.define('friend', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
	status: {type: DataTypes.STRING, defaultValue: 'pedding'}
})

User.prototype.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
}


User.hasMany(Task)
Task.belongsTo(User)

Task.hasMany(Subtask)
Subtask.belongsTo(Task)

User.hasOne(TaskAnalytics)
TaskAnalytics.belongsTo(User)

User.belongsToMany(User, {
  through: Friend,
  as: 'friends',
  foreignKey: 'userId',    // Кто добавляет в друзья
  otherKey: 'friendId'     // Кого добавляют в друзья
});

User.belongsToMany(User, {
  through: Friend,
  as: 'friendOf',
  foreignKey: 'friendId',  // Кого добавляют в друзья
  otherKey: 'userId'       // Кто добавляет
});


module.exports = {
	User,
	Friend,
	Task,
	Subtask,
	TaskAnalytics
}
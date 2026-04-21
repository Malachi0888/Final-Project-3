const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Task = require('./Task');

User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Task, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Task.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User,
  Category,
  Task,
};

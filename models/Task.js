const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Task;

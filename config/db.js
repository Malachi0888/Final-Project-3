const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTest ? ':memory:' : (process.env.DB_STORAGE || 'database.sqlite'),
  logging: false,
});

module.exports = sequelize;

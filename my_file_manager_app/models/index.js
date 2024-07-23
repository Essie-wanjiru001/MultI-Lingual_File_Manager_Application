// src/models/index.js
const sequelize = require('../config/database');
const User = require('./User');

const syncDatabase = async () => {
  await sequelize.sync({ force: true }); // Use { force: false } in production to avoid dropping tables
};

module.exports = {
  User,
  syncDatabase,
};

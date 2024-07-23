// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en',
  },
});

module.exports = User;

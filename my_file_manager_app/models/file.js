const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Make sure this matches the table definition (nullable)
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'files',
  timestamps: true,
  createdAt: 'created_at', // Match the column names in the database
  updatedAt: 'updated_at', // Match the column names in the database
});

module.exports = File;

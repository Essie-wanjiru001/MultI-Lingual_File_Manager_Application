const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const isTestEnv = process.env.NODE_ENV === 'test';
console.log('isTestEnv:', isTestEnv);


// Create a Sequelize instance for ORM
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: isTestEnv ? process.env.DB_TEST_NAME : process.env.DB_NAME,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false // Set to `console.log` to see SQL queries
});

// Create a MySQL connection pool for direct queries
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: isTestEnv ? process.env.DB_TEST_NAME : process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { sequelize, pool };

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'users',
  timestamps: false,
  
});

// Hash password before creating user
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

// Static method to find user by username
User.findByUsername = async function (username) {
  return await this.findOne({ where: { username } });
};

// Static method to find user by email
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

// Static method to validate password
User.validatePassword = async function (user, password) {
  return await bcrypt.compare(password, user.password);
};

// // Instance method to safely return user data without password
// User.prototype.toJSON = function() {
//   const values = { ...this.get() };
//   delete values.password;
//   return values;
// };

module.exports = User;

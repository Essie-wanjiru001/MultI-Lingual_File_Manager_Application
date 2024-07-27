const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { sequelize } = require('../config/database');

describe('User Registration and Login', () => {
  beforeAll(async () => {
    // Sync the database to ensure the model is up to date
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Clean up after tests
    await User.destroy({ where: {} });
    // Make sure to close the database connection at the very end
    await sequelize.close();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ email: 'testuser@example.com', password: 'securepassword', username: 'testuser' });

    // Debug response
    console.log('Register Response Headers:', response.header);
    console.log('Register Response Status:', response.statusCode);

    expect(response.statusCode).toBe(302); // Expecting a redirect
    expect(response.header.location).toBe('/login');
  });

  it('should log in with valid credentials', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'securepassword' });

    // Debug response
    console.log('Login Response Headers:', response.header);
    console.log('Login Response Status:', response.statusCode);

    expect(response.statusCode).toBe(302); // Expecting a redirect
    expect(response.header.location).toBe('/');
  });

  it('should not log in with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' });

    // Debug response
    console.log('Invalid Login Response Headers:', response.header);
    console.log('Invalid Login Response Status:', response.statusCode);

    expect(response.statusCode).toBe(302); // Expecting a redirect
    expect(response.header.location).toBe('/login');
  });
});

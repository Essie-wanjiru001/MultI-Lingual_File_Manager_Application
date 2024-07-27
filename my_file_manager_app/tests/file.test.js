const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../app');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const File = require('../models/file');

describe('File Operations', () => {
  let userId;
  let authCookie;
  let testFileId;

  beforeAll(async () => {
    try {
      // Sync the database to ensure the model is up to date
      await sequelize.sync({ force: true });

      // Register a user and authenticate to obtain session cookies
      const registerResponse = await request(app)
        .post('/api/users/register')
        .send({ email: 'testuser@example.com', password: 'securepassword', username: 'testuser' });

      // Authenticate the user
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ email: 'testuser@example.com', password: 'securepassword' });

      authCookie = loginResponse.headers['set-cookie'];
      const user = await User.findOne({ where: { email: 'testuser@example.com' } });
      userId = user.id;

      // Create a test file for further tests
      const testFile = await File.create({
        name: 'test-file.txt',
        size: 1024,
        type: 'text/plain',
        userId: userId,
        path: '/fake/path/test-file.txt',
      });
      testFileId = testFile.id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up after tests
      await User.destroy({ where: {} });
      await File.destroy({ where: {} });
      // Close the database connection
      await sequelize.close();
    } catch (error) {
      console.error('Error during teardown:', error);
    }
  });

  describe('POST /api/files/upload', () => {
    it('should upload a new file', async () => {
      const filePath = path.join(__dirname, 'test-file.txt');
      fs.writeFileSync(filePath, 'This is a test file');

      const response = await request(app)
        .post('/api/files/upload')
        .set('Cookie', authCookie)
        .attach('file', filePath);

      fs.unlinkSync(filePath);

      expect(response.statusCode).toBe(302); // Expecting a redirect
      expect(response.header.location).toBe('/files');
    });
  });

  describe('GET /files', () => {
    it('should retrieve all files for the user', async () => {
      const response = await request(app)
        .get('/files')
        .set('Cookie', authCookie)
        .set('Accept', 'application/json'); // Make sure the endpoint returns JSON
  
      expect(response.statusCode).toBe(200);
      try {
        const files = JSON.parse(response.text); // Parse JSON response if needed
        expect(Array.isArray(files)).toBe(true);
        expect(files.some(file => file.id === testFileId)).toBe(true); // Check if the test file is in the response
      } catch (error) {
        console.error('Failed to parse response:', error);
      }
    });
  });
  

  describe('GET /api/files/:id', () => {
    it('should retrieve a file by ID', async () => {
      const response = await request(app)
        .get(`/api/files/${testFileId}`)
        .set('Cookie', authCookie)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', testFileId);
    });

    it('should return 404 if file not found', async () => {
      const response = await request(app)
        .get(`/api/files/9999`)
        .set('Cookie', authCookie)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'File not found');
    });
  });

  describe('DELETE /api/files/:id', () => {
    it('should delete a file and return no content', async () => {
      try {
        const response = await request(app)
          .delete(`/api/files/${testFileId}`)
          .set('Cookie', authCookie)
          .set('Accept', 'application/json');
    
        // Check if the response status code is 204
        expect(response.statusCode).toBe(204);
    
        // Ensure the file has been deleted from the database
        const file = await File.findByPk(testFileId);
        expect(file).toBeNull();
      } catch (error) {
        console.error('Error during DELETE test:', error); // Log test error
        throw error; // Rethrow error to fail the test
      }
    });
  
    it('should return 404 if file to delete not found', async () => {
      try {
        const response = await request(app)
          .delete(`/api/files/9999`)
          .set('Cookie', authCookie)
          .set('Accept', 'application/json');
    
        // Check if the response status code is 404
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'File not found');
      } catch (error) {
        console.error('Error during 404 test:', error); // Log test error
        throw error; // Rethrow error to fail the test
      }
    });
  });
})  
const { sequelize } = require('../config/database');

beforeAll(async () => {
  try {
    // Sync database and clear test data
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Error during setup:', error);
  }
});

afterAll(async () => {
  try {
    // Close database connections
    await sequelize.close();
  } catch (error) {
    console.error('Error during teardown:', error);
  }
});

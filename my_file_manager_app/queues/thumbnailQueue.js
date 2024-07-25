const Queue = require('bull');
const redisClient = require('../config/redis');

const thumbnailQueue = new Queue('thumbnail-generation', {
  redis: {
    client: redisClient,
  },
});

module.exports = thumbnailQueue;
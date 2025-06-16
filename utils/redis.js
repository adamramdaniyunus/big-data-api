const { Redis } = require('ioredis');

// Create a new Redis instance
// default configuration will connect to localhost:6379
const redis = new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

module.exports = redis;

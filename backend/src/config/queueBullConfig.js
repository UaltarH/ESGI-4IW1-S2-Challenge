const Queue = require('bull');

const cartQueue = new Queue('cart-expiration', {
    redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
    }
});

module.exports = { cartQueue };
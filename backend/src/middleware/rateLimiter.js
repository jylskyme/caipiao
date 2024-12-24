const rateLimit = require('express-rate-limit');
const config = require('../../config/default');

// 创建限流中间件
const rateLimiter = rateLimit({
    windowMs: config.api.rateLimit.windowMs,
    max: config.api.rateLimit.max,
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试'
    }
});

module.exports = { rateLimiter }; 
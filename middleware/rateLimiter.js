const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        success: false,
        error: 'Too many login attempts',
        message: 'Please try again after 15 minutes.'
    },
    skipSuccessfulRequests: true,
});

// Content creation rate limiter
const createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit to 10 creations per hour
    message: {
        success: false,
        error: 'Creation limit exceeded',
        message: 'You can only create 10 items per hour.'
    },
});

// Search rate limiter
const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute
    message: {
        success: false,
        error: 'Too many searches',
        message: 'Please slow down your search requests.'
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    createLimiter,
    searchLimiter
};

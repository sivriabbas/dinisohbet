const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dinisohbet-api-secret-key-2024';
const JWT_EXPIRATION = '7d';

// Generate JWT token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'No token provided'
        });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
        return res.status(403).json({
            success: false,
            error: 'Invalid token',
            message: 'Token is invalid or expired'
        });
    }

    req.user = decoded;
    next();
}

// Optional authentication - doesn't fail if no token
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }

    next();
}

// API Key authentication
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API key required',
            message: 'Please provide an API key'
        });
    }

    // In production, validate against database
    // For now, accept any key that matches the pattern
    if (apiKey.startsWith('dini_')) {
        req.apiKey = apiKey;
        next();
    } else {
        return res.status(403).json({
            success: false,
            error: 'Invalid API key',
            message: 'The provided API key is invalid'
        });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    optionalAuth,
    authenticateApiKey,
    JWT_SECRET
};

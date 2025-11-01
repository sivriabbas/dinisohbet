const xss = require('xss');
const { body, validationResult } = require('express-validator');

// XSS sanitization middleware
function sanitizeInput(req, res, next) {
    // Sanitize body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        });
    }

    // Sanitize query
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = xss(req.query[key]);
            }
        });
    }

    next();
}

// Validation rules for common operations
const validationRules = {
    register: [
        body('username').trim().isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
    ],
    login: [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty()
    ],
    post: [
        body('title').trim().isLength({ min: 3, max: 200 }),
        body('content').trim().isLength({ min: 10, max: 5000 })
    ],
    comment: [
        body('content').trim().isLength({ min: 1, max: 1000 })
    ]
};

// Validation error handler
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
}

module.exports = {
    sanitizeInput,
    validationRules,
    handleValidationErrors
};

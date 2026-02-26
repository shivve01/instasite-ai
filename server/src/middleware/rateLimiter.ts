import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Please try again later.',
    },
});

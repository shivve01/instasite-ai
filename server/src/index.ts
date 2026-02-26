import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter.js';
import generateRouter from './routes/generate.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGIN
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting on API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api', generateRouter);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 InstaSite AI Server running on http://localhost:${PORT}`);
    console.log(`   AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
    console.log(`   AI Model: ${process.env.AI_MODEL || 'gpt-4o'}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;

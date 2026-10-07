import express, { Request, Response } from 'express';
import cors from 'cors';
import agentRoutes from './routes/agent.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Delivery Agent Management System API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/agents', agentRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;

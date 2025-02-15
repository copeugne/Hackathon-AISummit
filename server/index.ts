import express from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import forecastRoutes from './routes/forecast.ts';
import triageRoutes from './routes/triage.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'healthy' });
});

// Routes
app.use('/api/forecast', forecastRoutes);
app.use('/api/triage', triageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app if needed (ESM syntax)
export default app;

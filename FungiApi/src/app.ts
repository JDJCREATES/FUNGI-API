import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import './config/db';
import mushroomRoutes from './routes/mushrooms';

const app = express();
app.use(express.json());

app.use('/api/mushrooms', mushroomRoutes);

// Global error handler
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

export default app;

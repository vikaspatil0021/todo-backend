import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/mongodb';

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
// import logRoutes from './routes/log.routes';

import { authenticate } from './middlewares/auth.middleware';


dotenv.config();

connectDB()

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(authenticate); //verify token

app.use('/api/task', taskRoutes);
// app.use('/api/logs', logRoutes);

export default app;

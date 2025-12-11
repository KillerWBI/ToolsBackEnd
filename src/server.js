import { errors } from 'celebrate';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

import ToolsRout from './routes/ToolsRout.js';
import UsersRout from './routes/UsersRout.js';
import bookingsRouter from './routes/bookingsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// ===== Routes =====
app.use(authRoutes); // авторизация и регистрация
app.use(ToolsRout); // инструменты
app.use(UsersRout); // пользователи
app.use('/api/bookings', bookingsRouter); // бронирование

// ===== Handlers =====
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// ===== DB =====
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

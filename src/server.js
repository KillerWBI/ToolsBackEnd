import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import helmet from 'helmet';

import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { swaggerSpec } from './swagger.js';

import authRoutes from './routes/authRoutes.js';
import bookingsRouter from './routes/bookingsRoutes.js';
import categoriesRouter from './routes/categoriesRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import toolsRoutes from './routes/toolsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      },
    },
  })
);

const allowedOrigins = [
  'https://tool-next-mauve.vercel.app',
  'http://localhost:3000',
  'https://toolsbackend-zzml.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// ===== API Documentation =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Routes =====
app.use('/api/auth', authRoutes); // авторизация и регистрация
app.use('/api/tools', toolsRoutes); // инструменты
app.use('/api/users', usersRoutes); // пользователи
app.use('/api/bookings', bookingsRouter); // бронирование
app.use('/api/categories', categoriesRouter); // категории
app.use('/api/feedbacks', feedbackRouter); // отзывы

// ===== Handlers =====
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// ===== DB =====
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});

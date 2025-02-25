import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { routes } from './routes/index.js';
import { morganMiddleware } from './utils/logger.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morganMiddleware());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(errorMiddleware);

export { app };
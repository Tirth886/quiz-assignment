import express from 'express';
import router from './routes/index.js';
import {  errorResponse, healthCheck, responseFormat } from './provider/Middleware.js';

const app = express();

app.use(responseFormat);

app.use(express.json());
app.use('/', healthCheck);
app.use('/api', router);

app.use(errorResponse);

export default app;

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { usersRouter } from 'routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/users', usersRouter);

app.listen(3000);
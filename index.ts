import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes/router';

dotenv.config();
const app: Express = express();

app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'Alive!',
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${port}`);
});

import { Request, Response } from 'express';

const ping = (_req: Request, res: Response) => {
  res.json({
    message: 'Server is up and running',
  });
};

export default ping;

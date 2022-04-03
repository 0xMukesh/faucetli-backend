import express from 'express';

const router = express.Router();

import token from '../controllers/token';
import ping from '../controllers/ping';

router.get('/ping', ping);
router.get('/token', token);

export default router;

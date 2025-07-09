import { Router } from 'express';

import { getRecentLogs } from '../controllers/log.controller';

const router = Router();

router.get("/", getRecentLogs);

export default router;
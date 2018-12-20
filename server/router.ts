import { Router } from 'express';

import * as auth from './auth';
import { requestAuthMiddleware } from './middleware';

const router = Router();

router.use('/login', auth.login);
router.use('/register', auth.register);

router.use(requestAuthMiddleware);

export default router;

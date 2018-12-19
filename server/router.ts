import { Router } from 'express';

import * as auth from './auth';

const router = Router();

router.use('/login', auth.login);
router.use('/register', auth.register);

export default router;

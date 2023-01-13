/**
 * Rutas para usuarios /Auth
 * host /apiu/auth/
 */

import { response, Router } from 'express';
import { check } from 'express-validator';
import { createUser, login, refresh } from '../controller/index.js';

const router= Router();

router.post('/create', createUser);

router.post('/login', login);

router.get('/refresh', refresh);

export default router;

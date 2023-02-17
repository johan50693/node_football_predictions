/**
 *  Rutas para usuarios / users
 *  host /api/users/
 */

import { Router } from 'express'
import { listUsersPoints } from '../controller/user.js';
import { validarCampos, validarJWT } from '../middlewares/index.js';

const router = Router();

router.use(validarJWT)

router.get('/list/points/:tournament',[validarCampos],listUsersPoints)

export default router
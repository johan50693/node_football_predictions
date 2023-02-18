/**
 *  Rutas para usuarios / users
 *  host /api/users/
 */

import { Router } from 'express'
import { check } from 'express-validator';
import { assignToTournament, listUsersPoints } from '../controller/user.js';
import { validarCampos, validarJWT } from '../middlewares/index.js';

const router = Router();

router.use(validarJWT)

router.get('/list/points/:tournament',[validarCampos],listUsersPoints)
router.post('/assignToTournament',
  [
    check('user_id', 'El id del usuario es un campo obligatorio').not().isEmpty(),
    check('tournament_id', 'El id del torneo es un campo obligatoria').not().isEmpty(),
    validarCampos
  ], assignToTournament)

export default router
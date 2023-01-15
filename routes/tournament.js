/**
 *  Rutas para torneos / tournaments
 *  host /api/events
 */


import { Router } from 'express'
import { createTournament, updateTournament } from '../controller/index.js';
import { validarJWT, validarCampos } from '../middlewares/index.js';

const router= Router()

//  Asignar middleware a todas las rutas
router.use(validarJWT);

router.post('/create',validarCampos, createTournament)
router.put('/:id',validarCampos, updateTournament)

export default router;



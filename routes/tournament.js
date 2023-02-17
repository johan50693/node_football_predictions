/**
 *  Rutas para torneos / tournaments
 *  host /api/tournament/
 */


import { Router } from 'express'
import { check } from 'express-validator';
import { createTournament, deleteTournament, getTournament, listTournaments, updateTournament } from '../controller/index.js';
import { validarJWT, validarCampos } from '../middlewares/index.js';

const router= Router()

//  Asignar middleware a todas las rutas
router.use(validarJWT);

router.post('/create',
  [
    check('name', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('description', 'La descripción es un campo obligatoria').not().isEmpty(),
    check('exact_marker', 'El marcador exacto es un campo obligatorio').not().isEmpty(),
    check('winner_selection', 'La seleccion del ganador es un campo obligatoria').not().isEmpty(),
    check('goals_of_a_team', 'Los goles de un equipo es un ccampo obligatorio').not().isEmpty(),
    check('goals_difference', 'La diferencia de goles es un campo obligatorio').not().isEmpty(),
    validarCampos
  ], createTournament)
router.put('/:id',
  [
    check('name', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('description', 'La descripción es un campo obligatoria').not().isEmpty(),
    check('exact_marker', 'El marcador exacto es un campo obligatorio').not().isEmpty(),
    check('winner_selection', 'La seleccion del ganador es un campo obligatoria').not().isEmpty(),
    check('goals_of_a_team', 'Los goles de un equipo es un ccampo obligatorio').not().isEmpty(),
    check('goals_difference', 'La diferencia de goles es un campo obligatorio').not().isEmpty(),
    validarCampos
  ], updateTournament)
router.get('/list',validarCampos, listTournaments)
router.get('/:id',validarCampos, getTournament)
router.delete('/:id',validarCampos, deleteTournament)

export default router;



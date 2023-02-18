/**
 *  Rutas para partidos / matches
 *  host /api/match/
 */

import { Router } from "express";
import { check } from "express-validator";
import { assignToTournament, createbyrange, createMatch, deleteMatch, getMatch, listMatch, updatebyrange, updateMatch } from "../controller/match.js";
import { validarCampos, validarJWT } from "../middlewares/index.js";



const router= Router()

//  Asignar middleware a todas las rutas
router.use(validarJWT)

router.post('/create',
  [
    check('team_a', 'El nombre del equipo A es un campo obligatorio').not().isEmpty(),
    check('team_b', 'El nombre del equipo B es un campo obligatorio').not().isEmpty(),
    check('goals_a', 'Los goles del equipo A son un campo obligatorio').exists(),
    check('goals_b', 'Los goles del equipo B son un campo obligatoria').exists(),
    check('penalties_a', 'Los goles de penalty para el equipo A son un campo obligatorio').exists(),
    check('penalties_b', 'Los goles de penalty para el equipo B son un campo obligatorio').exists(),
    check('date', 'La fecha del partido es un campo obligatorio').not().isEmpty(),
    validarCampos
  ], createMatch)

router.put('/:id',
[
  check('team_a', 'El nombre del equipo A es un campo obligatorio').not().isEmpty(),
  check('team_b', 'El nombre del equipo B es un campo obligatorio').not().isEmpty(),
  check('goals_a', 'Los goles del equipo A son un campo obligatorio').exists(),
  check('goals_b', 'Los goles del equipo B son un campo obligatoria').exists(),
  check('penalties_a', 'Los goles de penalty para el equipo A son un campo obligatorio').exists(),
  check('penalties_b', 'Los goles de penalty para el equipo B son un campo obligatorio').exists(),
  check('date', 'La fecha del partido es un campo obligatorio').not().isEmpty(),
  validarCampos
], updateMatch)

router.get('/list',[validarCampos], listMatch)
router.get('/:id',[validarCampos], getMatch)
router.delete('/:id',[validarCampos], deleteMatch)
router.post('/assignToTournament',
[
  check('tournament_id', 'El id del torneo es un campo obligatorio').not().isEmpty(),
  check('matches_id', 'El id del partido un campo obligatoria').not().isEmpty(),
  validarCampos
], assignToTournament)
router.put('/updatebyrange/results',[
  check('date', 'El campo fecha es obligatorio').not().isEmpty(),
  check('numberofdays', 'El campo cantidad de días es obligatorio').not().isEmpty(),
  validarCampos
],updatebyrange);
router.post('/createbyrange/results',[
  check('date', 'El campo fecha es obligatorio').not().isEmpty(),
  check('numberofdays', 'El campo cantidad de días es obligatorio').not().isEmpty(),
  validarCampos
],createbyrange);


export default router
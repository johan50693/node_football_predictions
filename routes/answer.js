import { Router } from 'express'
import { createAnswer, deleteAnswer, getAnswer, listAnswer, updateAnswer } from '../controller/index.js';
import { validarCampos, validarJWT } from '../middlewares/index.js';

const router = Router();

router.use(validarJWT)

router.post('/create',
  [
    check('goals_a', 'Los goles del equipo A son un campo obligatorio').not().isEmpty(),
    check('goals_b', 'Los goles del equipo B son un campo obligatoria').not().isEmpty(),
    check('penalties_a', 'Los goles de penalty para el equipo A son un campo obligatorio').exists(),
    check('penalties_b', 'Los goles de penalty para el equipo B son un campo obligatorio').exists(),
    check('date', 'La fecha del partido es un campo obligatorio').not().isEmpty(),
    check('poll_id', 'La encuesta del partido es un campo obligatorio').not().isEmpty(),
    validarCampos
  ],createAnswer)

router.put('/:id',
  [
    check('goals_a', 'Los goles del equipo A son un campo obligatorio').not().isEmpty(),
    check('goals_b', 'Los goles del equipo B son un campo obligatoria').not().isEmpty(),
    check('penalties_a', 'Los goles de penalty para el equipo A son un campo obligatorio').exists(),
    check('penalties_b', 'Los goles de penalty para el equipo B son un campo obligatorio').exists(),
    check('date', 'La fecha del partido es un campo obligatorio').not().isEmpty(),
    check('poll_id', 'La encuesta del partido es un campo obligatorio').not().isEmpty(),
    validarCampos
  ],updateAnswer)

router.get('/list',[validarCampos],listAnswer)
router.get('/:id',[validarCampos],getAnswer)
router.delete('/:id',[validarCampos],deleteAnswer)


export default router
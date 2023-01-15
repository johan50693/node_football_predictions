/**
 * Rutas para usuarios /Auth
 * host /apiu/auth/
 */

import { Router } from 'express'
import { check } from 'express-validator'
import { createUser, login, refresh } from '../controller/index.js'
import { validarCampos } from '../middlewares/validar-campos.js'
import { validarJWT } from '../middlewares/index.js'

const router = Router()

router.post('/create',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    validarCampos
  ], createUser)

router.post('/login',
  [
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
  ], login)

router.get('/refresh', validarJWT ,refresh)

export default router

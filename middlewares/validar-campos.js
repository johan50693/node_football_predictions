import { validationResult } from 'express-validator'
import { response } from 'express'

export const validarCampos = (req, res = response, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 400,
      endpoint: 'api/auth/create',
      message: 'error',
      error: errors.mapped()
    })
  }
  next()
}

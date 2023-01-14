
import { request, response } from 'express'
import { validationResult } from 'express-validator'

export const createUser = (req = request, res = response) => {
  // manejo de errores
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped()
    })
  }

  res.json({
    code: 200,
    endpoint: 'api/auth/create',
    message: 'success'
  })
}

export const login = (req = request, res = response) => {
  res.json({
    code: 200,
    endpoint: 'api/auth/login',
    message: 'success'
  })
}

export const refresh = (req = request, res = response) => {
  res.json({
    code: 200,
    endpoint: 'api/auth/refresh',
    message: 'create success'
  })
}

import { request, response } from 'express'
import jwt from 'jsonwebtoken'


export const validarJWT = (req, res = response, next) => {

  // Obtener token
  const token = req.header('x-token')
  const privateKey = process.env.PRIVATE_KEY

  if (!token) {
    return res.status(401).json({
      code: 401,
      endpoint: req._parsedOriginalUrl.path,
      message: 'El token no esta definido en la petición',
    })
  }

  try {
    const { uid, name } = jwt.verify(token,privateKey)

    req.uid = uid
    req.name = name

  } catch (error) {
    return res.status(401).json({
      code: 401,
      endpoint: req._parsedOriginalUrl.path,
      message: 'El token no es válido',
    })
  }
  next()

}

import { request, response } from 'express'
import { connection } from '../db/config.js'
import bcrypt from 'bcryptjs'
import { generarJWT } from '../helpers/index.js'

export const createUser = async (req = request, res = response) => {
  
  let { email, password, name } = req.body

  try {

    const [ result ] = await connection.execute("SELECT * FROM users WHERE users.email = ?",[email])
    
    if (result.length > 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El usuario ya se encuentra registrado'
      })
    }

    // * Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    password= hash;

    // * Fecha actual
    let date = new Date()
    date.toISOString().split('T')[0]

    const [ resultInsert ] = await connection.execute("INSERT INTO users (name, email, password, created_at )VALUES (?,?,?,?)",[name, email, password, date])
    
    // * Generar token JWT
    const token = await generarJWT(resultInsert.insertId,name)

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Usuario creado de manera exitosa',
      uid: resultInsert.insertId,
      name: name,
      token
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error en la creación del usuario, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const login = async (req = request, res = response) => {

  let { email, password, name } = req.body

  try {

    const [ result ] = await connection.execute("SELECT * FROM users WHERE users.email = ?",[email])
    
    if (result.length < 0) {
      return res.status(400).json({
        code: 400,
        endpoint: 'api/auth/login',
        message: 'El usuario no se encuentra registrado'
      })
    }

    // * Comparar contraseña
    
    const passwordIsValid = bcrypt.compareSync(password, result[0].password)
    
    if (!passwordIsValid) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El usuario y contraseña no son válidos'
      })
    }

    // * Generar token JWT
    const token = await generarJWT(result[0].id,result[0].name)

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Inicio de sesión exitoso',
      uid: result[0].id,
      name: result[0].name,
      token
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error en el inicio de sesión, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const refresh = async (req = request, res = response) => {

  const { uid, name } = req
  // Generar token jwt
  const token = await generarJWT(uid,name)

  res.json({
    code: 200,
    endpoint: req.originalUrl,
    message: 'El token se ha generado de manera exitosa',
    uid,
    name,
    token
  })
}

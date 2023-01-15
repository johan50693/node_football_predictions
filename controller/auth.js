
import { request, response } from 'express'
import { connection } from '../db/config.js'
import bcrypt from 'bcryptjs'

export const createUser = async (req = request, res = response) => {
  
  let { email, password, name } = req.body

  try {

    const [ result ] = await connection.execute("SELECT * FROM users WHERE users.email = ?",[email])
    
    if (result.length > 0) {
      return res.status(400).json({
        code: 400,
        endpoint: 'api/auth/create',
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
    
    // TODO: Generar token JWT y retornarlo

    return res.json({
      code: 200,
      endpoint: 'api/auth/create',
      message: 'Usuario creado de manera exitosa',
      uid: resultInsert.insertId,
      name: name
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: 'api/auth/create',
      message: 'No se ha podido crear el usuario',
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
        endpoint: 'api/auth/login',
        message: 'El usuario y contraseña no son válidos'
      })
    }

    // TODO: Generar token JWT y retornarlo

    return res.json({
      code: 200,
      endpoint: 'api/auth/login',
      message: 'Inicio de sesión exitoso',
      uid: result[0].id,
      name: result[0].name
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: 'api/auth/login',
      message: 'Ha ocurrido un error al iniciar sesión',
      error
    })
  }
}

export const refresh = (req = request, res = response) => {
  res.json({
    code: 200,
    endpoint: 'api/auth/refresh',
    message: 'create success'
  })
}

import { response } from "express"
import { connection } from "../db/config.js"
import { pollGetById } from "../models/index.js"

export const createAnswer = async (req, res=response) => {

  const { goals_a, goals_b, penalties_a, penalties_b, date, poll_id} = req.body
  const uid = req.uid

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {

    const isValidPoll = await pollGetById(poll_id)

    if (isValidPoll <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El id de la encuesta suministrada no esta registrado',
      })
    }

    const [ result ] = await connection.execute("SELECT * FROM answers a WHERE a.user_id=? AND a.poll_id=?",[uid,poll_id])
    
    if (result.length > 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'La respuesta ya se encuentra registrada'
      })
    }
    
    await connection.execute("INSERT INTO answers (goals_a,goals_b,penalties_a,penalties_b,date,created_at,poll_id,user_id,status)VALUES (?,?,?,?,?,?,?,?,1)",[goals_a, goals_b, penalties_a, penalties_b, date, createdAt,poll_id,uid])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'La respuesta fue cargada de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al crear la respuesta, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const updateAnswer = async (req, res=response) => {

  const { goals_a, goals_b, penalties_a, penalties_b, date, poll_id} = req.body
  const uid = req.uid
  const id = req.params.id

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {

    const [ result ] = await connection.execute("SELECT * FROM answers a WHERE a.id=?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El id de la respuesta no se encuentra registrado'
      })
    }
    
    await connection.execute("UPDATE answers SET goals_a=?, goals_b=?, penalties_a=?, penalties_b=?, date=?, user_id=? WHERE id=?",[goals_a, goals_b, penalties_a, penalties_b, date,uid,id])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'La respuesta fue actualizada de manera exitosa'
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al actualizar la respuesta, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const listAnswer = async (req, res = response) => {
  
  const uid = req.uid

  try {
    const [ result ] = await connection.execute("SELECT * FROM answers a WHERE a.status=1 AND a.user_id=?",[uid])
    
    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retornan la lista de respuestas',
      data: result
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al listar las respuestas, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const getAnswer = async (req, res = response) => {

  const id = req.params.id
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM answers a WHERE a.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'La respuesta no se encuentra registrada'
      })
    }

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retorna la respuesta solicitada',
      data: result
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al obtener la respuesta, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const deleteAnswer = async (req, res = response) => {

  const id = req.params.id
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM answers a WHERE a.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'La respuesta enviada no se encuentra registrada'
      })
    }

    await connection.execute("UPDATE  answers a SET status=0 WHERE a.id = ?",[id])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se ha eliminado la respuesta de forma exitosa',
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al eliminar la respuesta, comuniquese con el equipo de soporte',
      error
    })
  }
}


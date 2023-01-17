import { response } from 'express'
import { connection } from '../db/config.js'

export const createMatch = async (req, res=response) => {

  const {team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date} = req.body

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {
    
   await connection.execute("INSERT INTO matches (team_a,team_b,goals_a,goals_b,penalties_a,penalties_b,date,created_at, status)VALUES (?,?,?,?,?,?,?,?,1)",[team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date, createdAt])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'El partido fue creado de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al crear el partido, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const updateMatch = async (req, res=response) => {

  const {team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date} = req.body
  const id = req.params.id

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {

    const [ result ] = await connection.execute("SELECT * FROM matches m WHERE m.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El partido no se encuentra registrado'
      })
    }
    
    await connection.execute("UPDATE matches  SET team_a = ?, team_b = ?, goals_a = ?, goals_b = ?, penalties_a = ?, penalties_b = ?, date = ? WHERE id = ?",[team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date, id])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'El partido fue actualizado de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al crear el partido, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const listMatch = async (req, res = response) => {
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM matches m WHERE m.status=1")
    
    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retornan la lista de partidos',
      data: result
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al listar los partidos, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const getMatch = async (req, res = response) => {

  const id = req.params.id
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM matches m WHERE m.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El el partido no se encuentra registrado'
      })
    }

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retorna el partido solicitado',
      data: result
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al obtener el torneo, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const deleteMatch = async (req, res = response) => {

  const id = req.params.id
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM matches m WHERE m.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El partido enviado no se encuentra registrado'
      })
    }

    await connection.execute("UPDATE  matches m SET status=0 WHERE m.id = ?",[id])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se ha eliminado el partido de forma exitosa',
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al obtener el torneo, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const assignToTournament = async (req, res=response) => {

  const {tournament_id, matches_id } = req.body
  const created_by = req.uid
  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0] 

  try {
    
    const [ result ] = await connection.execute("SELECT * FROM poll p WHERE p.tournament_id= ? AND p.matches_id= ?",[tournament_id, matches_id])
    
    if ( result.length < 0 ) {
      
      await connection.execute("UPDATE poll SET tournament_id= ?, matches_id = ?, created_by = ? WHERE poll.id= ?",[tournament_id, matches_id, created_by, result[0].id])
    }else{

      await connection.execute("INSERT INTO poll (tournament_id, matches_id, created_by, status, created_at )VALUES (?,?,?,1,?)",[tournament_id, matches_id, created_by, createdAt])
    }
    
    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'El partido fue asignado de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al crear el partido, comuniquese con el equipo de soporte',
      error
    })
  }
}
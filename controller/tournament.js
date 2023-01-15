import { response } from 'express'
import { connection } from '../db/config.js'

export const createTournament = async (req, res = response) => {

  const {name,description,exact_marker,winner_selection,goals_of_a_team,goals_difference } = req.body
  
  try {
    
    const [ insertTournaments ] = await connection.execute("INSERT INTO tournaments (name, description )VALUES (?,?)",[name, description])
    await connection.execute("INSERT INTO points (exact_marker,winner_selection,goals_of_a_team,goals_difference, tournament_id )VALUES (?,?,?,?,?)",[exact_marker, winner_selection, goals_of_a_team, goals_difference, insertTournaments.insertId ])
    await connection.execute("INSERT INTO tournaments_users (user_id, tournament_id, status )VALUES (?,?,?)",[req.uid, insertTournaments.insertId,1])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Torneo creado de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al crear el torneo, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const updateTournament = async (req, res = response) => {

  const {name,description,exact_marker,winner_selection,goals_of_a_team,goals_difference } = req.body
  const id = req.params.id
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM tournaments t WHERE t.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El torneo enviado no se encuentra registrado'
      })
    }

    await connection.execute("UPDATE  tournaments t SET name= ?, description= ? WHERE t.id = ?",[name, description,id])

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Torneo actualizado de manera exitosa'
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al crear el torneo, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const listTournaments = async (req, res = response) => {

  const uid = req.uid
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM tournaments t INNER JOIN tournaments_users tu ON t.id = tu.tournament_id WHERE tu.user_id = ?",[uid])
    
    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retornan la lista de torneos',
      data: result
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al listar el torneo, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const getTournament = async (req, res = response) => {

  const id = req.params.id
  
  try {
    const [ result ] = await connection.execute("SELECT * FROM tournaments t WHERE t.id = ?",[id])
    
    if (result.length <= 0) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El torneo enviado no se encuentra registrado'
      })
    }

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retorna el torneo solicitado',
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
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
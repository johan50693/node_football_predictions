import { response } from 'express'
import { connection } from '../db/config.js'

export const listUsersPoints = async (req, res = response) => {
  
  // const uid = req.uid
  const tournament = req.params.tournament

  try {
    const [ result ] = await connection.execute(`
                                                  select 	u.id , u.name ,
                                                      (
                                                        if((a.goals_a = m.goals_a and a.goals_b = m.goals_b),p2.exact_marker,0) +
                                                        if((a.goals_a = m.goals_a),p2.goals_of_a_team ,0) +
                                                        if((a.goals_b = m.goals_b),p2.goals_of_a_team ,0) +
                                                        if(ABS(a.goals_a - a.goals_b) = ABS(m.goals_a-m.goals_b),p2.goals_difference  ,0) +
                                                        case
                                                            when (m.goals_a > m.goals_b) and (a.goals_a > a.goals_b) THEN p2.winner_selection
                                                            when (m.goals_b > m.goals_a) and (a.goals_b > a.goals_a) THEN p2.winner_selection
                                                            else 0
                                                        end 
                                                      ) as points
                                                  from matches m
                                                  inner join poll p on p.matches_id = m.id
                                                  inner  join answers a on a.poll_id = p.id
                                                  inner join users u on u.id = a.user_id 
                                                  inner join points p2 on p2.tournament_id = p.tournament_id 
                                                  where p.tournament_id = ?
                                                  GROUP BY points, u.id 
                                                `,[tournament])
    
    const data = []

    result.forEach( (user) => {

      const id = user.id
      if(data[id] == null){
        data[id] = []
        data[id] = user
      }else{
        data[id].points = data[id].points + user.points
      }

    })

    const dataResponse = data.filter( (user) => user != null )
    dataResponse.sort((x, y) =>{
      if(x.points == y.points) {
        return 0; 
      }
      if(x.points > y.points) {
        return -1;
      }
      return 1;
    })

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Se retornan la lista de usuarios y sus puntos',
      dataResponse
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al listar el orden de los participantes, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const assignToTournament = async (req, res = response) => {

  const {email, tournament_id } = req.body
  
  try {
    
    const [userResult] = await connection.execute("select * from users u where u.email = ?",[email])

    if(userResult.length <= 0){
      return res.json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El usuario no se encuentra registrado',
      })
    }

    const user_id = userResult[0].id
    
    const [result] = await connection.execute("select * from tournaments_users tu where tu.user_id=? and tu.tournament_id=?",[user_id, tournament_id])

    if(result.length > 0){
      return res.json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El usuario ya esta registrado en el torneo seleccionado',
      })
    }
    
    await connection.execute("INSERT INTO tournaments_users (user_id, tournament_id, status )VALUES (?,?,1)",[user_id, tournament_id])

    const [pollResult] = await connection.execute("select * from poll p where p.tournament_id = ?",[tournament_id])
    
    for (let i = 0; i < pollResult.length; i++) {
      
      await connection.execute(`INSERT INTO answers 
                                ( goals_a, goals_b, penalties_a, penalties_b, date, created_at, poll_id, user_id, status)
                                select null,null, null, null, now(), now(), ${pollResult[i].id}, tu.user_id , 1 
                                from tournaments_users tu 
                                where tu.tournament_id =${tournament_id}  and tu.user_id =${user_id}`)
    }

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'El usuario fue asignado de manera exitosa',
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


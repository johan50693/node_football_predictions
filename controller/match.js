import { response } from 'express'
import { connection } from '../db/config.js'
import { canAssignMatches } from '../helpers/index.js'
import { getScraping, updateScraping } from '../scraping/web-scraping.js'

export const createMatch = async (req, res=response) => {

  const {league,team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date} = req.body

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {
    
    const [existMatch] = await connection.execute("SELECT * FROM matches WHERE date =? AND team_a =? AND team_b =?",[date,team_a, team_b])
    
    if (existMatch.length > 0) {
      return res.json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El partido ya se encuentra cargado',
      })
    }
    
    await connection.execute("INSERT INTO matches (league,team_a,team_b,goals_a,goals_b,penalties_a,penalties_b,date,created_at, status)VALUES (?,?,?,?,?,?,?,?,?,1)",[league,team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date, createdAt])

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
    const [ result ] = await connection.execute("SELECT * FROM matches m WHERE m.status=1 order by m.date DESC")
    
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
        message: 'El partido no se encuentra registrado'
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
    const isValidIds = await canAssignMatches(tournament_id,matches_id)

    if (!isValidIds) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El id de los registros suministrados no se considera valido',
      })
    }

    const [ result ] = await connection.execute("SELECT * FROM poll p WHERE p.tournament_id= ? AND p.matches_id= ?",[tournament_id, matches_id])
    
    if ( result.length > 0 ) {
      
      // await connection.execute("UPDATE poll SET tournament_id= ?, matches_id = ?, created_by = ? WHERE poll.id= ?",[tournament_id, matches_id, created_by, result[0].id])
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'El partido ya se encuentra asignado',
      })

    }else{

      const [pollInsert] = await connection.execute("INSERT INTO poll (tournament_id, matches_id, created_by, status, created_at )VALUES (?,?,?,1,?)",[tournament_id, matches_id, created_by, createdAt])
      await connection.execute(`INSERT INTO answers 
                                ( goals_a, goals_b, penalties_a, penalties_b, date, created_at, poll_id, user_id, status)
                                select null,null, null, null, now(), now(), ${pollInsert.insertId}, tu.user_id , 1 
                                from tournaments_users tu 
                                where tu.tournament_id =${tournament_id}`)
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

export const updatebyrange = async (req, res=response) => {

  const {date,numberofdays} = req.body
  
  try {

    for (let i = 0; i < numberofdays; i++) {
      let today = new Date(date)
      today.setDate(today.getDate() + i)
      const newDate= today.toISOString().split("T")[0].split('-')
      await updateScraping(newDate[0],newDate[1],newDate[2])
    }
    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Los resultados de los partidos fueron actualizados de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al actualizar los partidos, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const createbyrange = async (req, res=response) => {

  const {date,numberofdays} = req.body
  
  try {

    for (let i = 0; i < numberofdays; i++) {
      let today = new Date(date)
      today.setDate(today.getDate() + i)
      const newDate= today.toISOString().split("T")[0].split('-')
      await getScraping(newDate[0],newDate[1],newDate[2])
    }
    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Las proximas jornadas fueron cargadas de manera exitosa',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al actualizar los partidos, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const checkUpdateByDay = async (req, res=response) => {

  // * Fecha actual
  let dateFull = new Date()
  let date = new Date().toISOString().split('T')[0]
  let hours = new Date().toTimeString().split(' ')[0]
  let name = "checkUpdateByDay"
  let schedule = (Number(hours.split(':')[0]) < 12) ? 'AM':'PM'
  let type = 'UPDATE'
  let diference = 0
  let canUpdate = true

  try {

    const [ result ] = await connection.execute("select *from cron_job cj where cj.created_at =? and cj.name=?",[date,name])
    
    if(result.length == 20) {
      return res.status(400).json({
        code: 400,
        endpoint: req.originalUrl,
        message: 'Las actualizaciones diarias ya se han completado',
      })
    }

    if(result.length > 0) {
      
      let lastDate= new Date(result[result.length-1].date_of_execution)
      let actualDate = new Date()
      diference = (actualDate.getTime() - lastDate.getTime()) / 1000 / (3600) 
      // console.log(lastDate, actualDate, diference)

      if(diference < 1){
        canUpdate = false
      }
    }

    if  (canUpdate) {

      await connection.execute("INSERT INTO cron_job (name,type, schedule,date_of_execution,created_at,status)VALUES (?,?,?,?,?,1)",[name,type,schedule,dateFull,dateFull])
      let today = new Date()
      today.setDate(today.getDate() )
      const newDate= today.toISOString().split("T")[0].split('-')
      await updateScraping(newDate[0],newDate[1],newDate[2])

      return res.json({
        code: 200,
        endpoint: req.originalUrl,
        message: 'Se ha ejecutado  la tarea de actualizacion diaria de forma exitosa',
      })
    }


    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'Ya posee una actualización reciente, por favor verifique mas tarde',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al ejecutar la tarea de actualizacion diaria, comuniquese con el equipo de soporte',
      error
    })
  }
}

export const checkCreateByWeek = async (req, res=response) => {

  // * Fecha actual
  let dateFull = new Date()
  let date = new Date().toISOString().split('T')[0]
  let hours = new Date().toTimeString().split(' ')[0]
  let name = "checkCreateByWeek"
  let schedule = (Number(hours.split(':')[0]) < 12) ? 'AM':'PM'
  let type = 'CREATE'
  let diference = 0
  let canCreate = false
  let day = 7
  let sumDiference = 0

  try {

    const [ result ] = await connection.execute("select *from cron_job cj where cj.name=? order by cj.id desc",[name])

    if(result.length <= 0) {
      
      for (let i = 0; i < day; i++) {
        let today = new Date(date)
        today.setDate(today.getDate() + i)
        const newDate= today.toISOString().split("T")[0].split('-')
        await getScraping(newDate[0],newDate[1],newDate[2])
      }
      let dateEnd = new Date(date)
      dateEnd.setDate(dateEnd.getDate()+day)
      let newDateEnd = dateEnd.toISOString().split("T")[0]
      // console.log(newDateEnd);
      await connection.execute("INSERT INTO cron_job (name,type, schedule,date_of_execution,created_at,status,date_end)VALUES (?,?,?,?,?,1,?)",[name,type,schedule,dateFull,dateFull,newDateEnd])
      
      return res.json({
        code: 200,
        endpoint: req.originalUrl,
        message: 'Los partidos de la semana se han actualizado de manera exitosa',
      })
    }

    if(result.length > 0) {
      
      let lastDate= new Date(result[0].date_end).getTime()
      let actualDate = new Date().getTime()
      diference = (lastDate - actualDate) / (1000 * 60 *60 *24) 
      sumDiference = Math.trunc(diference)
      // console.log(lastDate, actualDate, diference, diference < 0, sumDiference)

      if(diference < 0){
        canCreate = true
      }
    }

    if  (canCreate) {

      for (let i = sumDiference; i < day; i++) {
        let today = new Date(date)
        today.setDate(today.getDate() + i)
        // console.log(today);
        const newDate= today.toISOString().split("T")[0].split('-')
        await getScraping(newDate[0],newDate[1],newDate[2])
      }
      let dateEnd = new Date(date)
      dateEnd.setDate(dateEnd.getDate()+day)
      let newDateEnd = dateEnd.toISOString().split("T")[0]
      // console.log(newDateEnd);
      await connection.execute("INSERT INTO cron_job (name,type, schedule,date_of_execution,created_at,status,date_end)VALUES (?,?,?,?,?,1,?)",[name,type,schedule,dateFull,dateFull,newDateEnd])
      
      return res.json({
        code: 200,
        endpoint: req.originalUrl,
        message: 'Los partidos de la semana se han actualizado de manera exitosa',
      })
    }

    return res.json({
      code: 200,
      endpoint: req.originalUrl,
      message: 'La actualización semanal ya se ha realizado',
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      endpoint: req.originalUrl,
      message: 'Ha ocurrido un error al ejecutar la tarea de actualizacion diaria, comuniquese con el equipo de soporte',
      error
    })
  }
}
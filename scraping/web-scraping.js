import fetch from 'node-fetch'
import cheerio  from 'cheerio'
import { connection } from '../db/config.js'

const tournaments= [
  'Premier League',
  'Copa del Rey',
  'FA Cup',
  'Coppa Italia',
  'Bundesliga',
  'Primera División',
  'Copa de Francia',
  'Serie A',
  'EFL Cup',
  'Champions League',
  'Europa League'
]

export const getScraping = async (year,month,day) => {

  let data =[]
  data = await getDataByScrapping(year,month,day)
  
  data.forEach( async (element,index) => {
    const {liga,teamA, teamB, goals_a, goals_b, penalties_a, penalties_b, dateFormat } = element
    await addMatchesByScrapping (liga,teamA, teamB, goals_a, goals_b, penalties_a, penalties_b, dateFormat)
  })
}

export const updateScraping = async (year,month,day) => {

  let data =[]
  data = await getDataByScrapping(year,month,day)
  
  data.forEach( async (element,index) => {
    const {liga,teamA, teamB, goals_a, goals_b, penalties_a, penalties_b, dateFormat } = element
    await updateMatchesByScrapping (liga,teamA, teamB, goals_a, goals_b, penalties_a, penalties_b, dateFormat)
  })
}

const cleanText = (text) => {
  return text.replace(/\t|\n|»/g,'')
}


const addMatchesByScrapping = async (league,team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date) => {

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {
    
    const [existMatch] = await connection.execute("SELECT * FROM matches WHERE date =? AND team_a =? AND team_b =?",[date,team_a, team_b])
    
    if (existMatch.length > 0) {
      return false
    }
    
    await connection.execute("INSERT INTO matches (league,team_a,team_b,goals_a,goals_b,penalties_a,penalties_b,date,created_at, status)VALUES (?,?,?,?,?,?,?,?,?,1)",[league,team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date, createdAt])

    return true

  } catch (error) {
    console.log(error);
    return false
  }
}

const updateMatchesByScrapping = async (league,team_a, team_b, goals_a, goals_b, penalties_a, penalties_b, date) => {

  // * Fecha actual
  let createdAt = new Date()
  createdAt.toISOString().split('T')[0]

  try {
    
    const [existMatch] = await connection.execute("SELECT * FROM matches WHERE date =? AND team_a =? AND team_b =?",[date,team_a, team_b])
    
    if (existMatch.length <= 0) {
      return false
    }

    await connection.execute("UPDATE matches SET  goals_a=?, goals_b=?, penalties_a=?, penalties_b=? WHERE date =? AND team_a =? AND team_b =?",[goals_a, goals_b, penalties_a, penalties_b,date,team_a, team_b])

    return true

  } catch (error) {
    console.log(error);
    return false
  }
}

const getDataByScrapping = async (year,month,day) => {

  let data= []
  // Formato DDMMYYYY
  const date = day+month+year
  // Formato YYYY-MM-DD
  const dateFormat = year+'-'+month+'-'+day
  // const today = new Date().toISOString().split("T")[0].split('-')
  const query = await fetch(`https://www.resultados-futbol.com/livescore/dia/${date}`)
  const html = await query.text()
  const $ = cheerio.load(html)

  const dataTable = $("#livescore-box .contentitem .listaligas").children()
  dataTable.each((index,elem) => {

    const liga = cleanText( $(elem).find('.title').text()).trim()
    const definiteLigue= tournaments.indexOf(liga);
    
    if (definiteLigue >= 0) {
      $(elem).find('#tablemarcador tr').each((i,el) => {

        const teamA = cleanText( $(el).find('.team-home').text().trim())
        const teamB = cleanText( $(el).find('.team-away').text().trim())
        const score = cleanText( $(el).find('.clase').text().trim())
        const scoreProcess = score.split('-')
        const isPenalties = score.indexOf('(')
        const existScoreProcess = score.indexOf('-')
        let goals_a = null
        let goals_b = null
        let penalties_a = null
        let penalties_b = null
        // console.log({liga,teamA,teamB,score,goals_a,goals_b,penalties_a,penalties_b,scoreProcess,existScoreProcess})
        // Se verifica si el resultado tiene penales o no 
        if (existScoreProcess >= 0) {
          if(isPenalties >= 0) {
            const scorePenalties_a = scoreProcess[0].trim().split('(')
            const scorePenalties_b = scoreProcess[1].trim().split(')')
            goals_a = Number(scorePenalties_a[0])
            penalties_a = Number(scorePenalties_a[1])
            goals_b = Number(scorePenalties_b[1])
            penalties_b = Number(scorePenalties_b[0])
          }else{
            goals_a = Number(scoreProcess[0].trim())
            goals_b = Number(scoreProcess[1].trim())
          }
        }
        // console.log({liga,teamA,teamB,score,goals_a,goals_b,penalties_a,penalties_b})
        data.push({liga,teamA,teamB,score,goals_a,goals_b,penalties_a,penalties_b,dateFormat})
      })
    }
  })
  return data
}
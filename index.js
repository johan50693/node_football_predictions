import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { answerRouter, authRouter, matchRouter, tournamentRouter } from './routes/index.js'
import cron from 'node-cron'
import { getScraping } from './scraping/web-scraping.js'
config()

// * Configuración de la aplicacion
const app = express()

// * CORS
app.use(cors())

// * Lectura y parseo del body
app.use(express.json())

// * Directorio publico
app.use(express.static('public'))

// * Definición de rutas
app.use('/api/auth', authRouter)
app.use('/api/tournament', tournamentRouter)
app.use('/api/match', matchRouter)
app.use('/api/answer', answerRouter)

app.listen(process.env.PORT, () => {
  console.log(`Servidor activo en el puerto ${process.env.PORT}`)
})



cron.schedule('*/15 */6 * * 1', async () => {
  console.log('running a task add matches At every 15th minute past every 6th hour on Monday.');
  for (let i = -1; i < 7; i++) {
    let today = new Date()
    today.setDate(today.getDate() + i)
    const newDate= today.toISOString().split("T")[0].split('-')
    await getScraping(newDate[0],newDate[1],newDate[2])
  }
});
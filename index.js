import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { answerRouter, authRouter, matchRouter, tournamentRouter, userRouter } from './routes/index.js'
import { cronEveryDayFirst, cronEveryDaySecond, cronEveryDayThird, cronEveryMonday } from './cronJob/cronJob.js'

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
app.use('/api/user', userRouter)

app.listen(process.env.PORT, () => {
  console.log(`Servidor activo en el puerto ${process.env.PORT}`)
})


cronEveryMonday()
cronEveryDayFirst()
cronEveryDaySecond()
cronEveryDayThird()
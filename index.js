import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { authRouter } from './routes/index.js'

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

app.listen(process.env.PORT, () => {
  console.log(`Servidor activo en el puerto ${process.env.PORT}`)
})

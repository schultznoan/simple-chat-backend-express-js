import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import router from './router/index'
import errorMiddleware from './middlewares/error/index'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))

app.use('/api', router)
app.use(errorMiddleware)

const init = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    app.listen(process.env.PORT, () => {
      console.log(`Server listen on ${process.env.PORT} PORT`)
    })
        
  } catch (error) {
    console.log(error)
  }
}

init()
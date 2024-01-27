import express = require('express')
import mongoose = require('mongoose')
import dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(express.json())

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
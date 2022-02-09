import express from 'express'
require('dotenv').config()
const morgan = require('morgan')
import {readdirSync} from 'fs'
import cors from 'cors'
import mongoose from 'mongoose'
const cookieParser = require('cookie-parser')

const app = express()

mongoose.connect(process.env.DATABASE).then(() => console.log('Database connected')).catch(err=> console.log(err))

app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)))


const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is listening on port ${port}`))

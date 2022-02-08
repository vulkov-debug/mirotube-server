import express from 'express'
require('dotenv').config()
const morgan = require('morgan')


const app = express()


app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('hit server endpoint')
})

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is listening on port ${port}`))


const express = require('express')
const app = new express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')
dotenv.config()

const fs = require('fs')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})

const myOwnMiddleware = (rwq, res, next) => {
    console.log('middleware applied!!')
    next()
}

// bring in routes
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.get('/', (req, res) => {
        console.log('hello')
        fs.readFile('docs/apiDocs.json', (err, data) => {
            if (err) {
                res.status(400).json({
                    error: err
                })
            }
            console.log('API Docs Returned')
            const docs = JSON.parse(data)
            res.json(docs)
        })
    })
    // middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(myOwnMiddleware)
app.use(cors())

app.use('/', postRoutes)
app.use('/', authRoutes)
app.use('/', userRoutes)

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'Unautohrized'
        })
    }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`A node js api is listening at port: ${port}`)
})
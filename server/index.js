const path = require('path')

// Env init
require('dotenv').config()
const {
    DATABASE,
    ENV,
    SERVER_PORT,
} = process.env

// DB init
const mongoose = require('mongoose')
mongoose.connect(DATABASE)
mongoose.Promise = global.Promise


// Server init
const express = require('express')
const api = require('./api')
const app = express()

if (ENV === 'prod') {
    app.get('*.js', function (req, res, next) {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        next()
    })
    app.use(express.static(path.join(__dirname, '../client/dist')))
}

app.use(require('body-parser').json())

app.use('/api/talks', api.talks)

app.use((err, req, res, next) => {
    console.log(err)
    res.end()
})

app.listen(SERVER_PORT, () =>
    console.log(`Server listen on port ${SERVER_PORT}`)
)

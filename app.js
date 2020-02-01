const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

//console.log('connecting to', config.MONGODB_URI)

const logger = require('./utils/logger')
logger.info('connecting to', config.MONGODB_URI)


mongoose.connect(config.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    //console.log('connected to MongoDB')
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    //console.log('error connection to MongoDB:', error.message)
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
//app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
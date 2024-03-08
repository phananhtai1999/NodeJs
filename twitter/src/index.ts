import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routers/users.routers'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routers/medias.routers'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { DIR_UPLOAD_IMAGE, DIR_UPLOAD_VIDEO } from './utils/dir'
import staticRouter from './routers/static.router'
import cors, { CorsOptions } from 'cors'
import tweetRouter from './routers/tweet.routers'
import bookmarkRouter from './routers/bookmark.routers'
import likeRouter from './routers/like.routers'
import searchRouter from './routers/search.routers'
import { createServer } from 'http'
import { Server } from 'socket.io'
import conversationRouter from './routers/conversation.routers'
import initSocket from './utils/socket'
import { isProduction } from './constants/config'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API) ',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    persistAuthorization: true
  },
  apis: ['./openapi/*.yaml'] // files containing annotations as above
}

const openapiSpecification = swaggerJSDoc(options)

config()
const app = express()
const httpServer = createServer(app)

const corsOptions: CorsOptions = {
  origin: isProduction ? process.env.CLIENT_URL : '*'
}
app.use(cors(corsOptions))
const port = process.env.PORT || 4000
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexTweets()
})

initFolder()

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likeRouter)
app.use('/searchs', searchRouter)
app.use('/conversations', conversationRouter)
// C1
// app.use('/static/video-stream', express.static(DIR_UPLOAD_VIDEO))

// C2
app.use('/static', staticRouter)
app.use(defaultErrorHandler)

initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Running on port ${port}`)
})

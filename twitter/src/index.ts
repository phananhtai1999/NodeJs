import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routers/users.routers'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routers/medias.routers'
import { initFolder } from './utils/file'
import staticRouter from './routers/static.router'
import cors, { CorsOptions } from 'cors'
import tweetRouter from './routers/tweet.routers'
import bookmarkRouter from './routers/bookmark.routers'
import likeRouter from './routers/like.routers'
import searchRouter from './routers/search.routers'
import { createServer } from 'http'
import conversationRouter from './routers/conversation.routers'
import initSocket from './utils/socket'
import { envConfig, isProduction } from './constants/config'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.1.0',
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

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
app.use(limiter)

const httpServer = createServer(app)
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}

app.use(helmet())
app.use(cors(corsOptions))
const port = envConfig.port || 4000

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

import { Router } from 'express'
import { wrap } from '~/utils/handlers'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHlsController,
  videoStatusController
} from '~/controllers/medias.controllers'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
const mediasRouter = Router()

mediasRouter.post('/upload-image', accessTokenValidation, wrap(uploadImageController))
mediasRouter.post('/upload-video', accessTokenValidation, wrap(uploadVideoController))
mediasRouter.post('/upload-video-hls', accessTokenValidation, wrap(uploadVideoHlsController))
mediasRouter.post('/video-status', accessTokenValidation, wrap(videoStatusController))

export default mediasRouter

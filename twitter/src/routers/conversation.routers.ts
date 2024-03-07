import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversation.controllers'
import { paginationValidator } from '~/middlewares/tweet.middleware'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { wrap } from '~/utils/handlers'

const conversationRouter = Router()

conversationRouter.get(
  '/recivers/:reciver_id',
  accessTokenValidation,
  paginationValidator,
  wrap(getConversationsController)
)

export default conversationRouter

import { Router } from 'express'
import { createLikeController, unLikeTweetController } from '~/controllers/like.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middleware'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { wrap } from '~/utils/handlers'

const likeRouter = Router()

likeRouter.post('/', accessTokenValidation, tweetIdValidator, wrap(createLikeController))
likeRouter.delete('/unlike-tweet/:tweet_id', accessTokenValidation, tweetIdValidator, wrap(unLikeTweetController))

export default likeRouter

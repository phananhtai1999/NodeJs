import { Router } from 'express'
import { wrap } from '~/utils/handlers'
import { accessTokenValidation, isUserLoggedInValidator } from '~/middlewares/users.middlewares'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweet.controllers'
import {
  audienceValidator,
  createTweetValidator,
  paginationValidator,
  tweetIdValidator
} from '~/middlewares/tweet.middleware'
const tweetRouter = Router()

tweetRouter.post('/', accessTokenValidation, createTweetValidator, wrap(createTweetController))
tweetRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidation),
  audienceValidator,
  wrap(getTweetController)
)

tweetRouter.get(
  '/:tweet_id/children',
  paginationValidator,
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidation),
  audienceValidator,
  wrap(getTweetChildrenController)
)

tweetRouter.get('/', paginationValidator, accessTokenValidation, wrap(getNewFeedsController))

export default tweetRouter

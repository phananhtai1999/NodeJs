import { Router } from 'express'
import { createBookmarkController, unBookmarkTweetController } from '~/controllers/bookmark.controllers'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { wrap } from '~/utils/handlers'

const bookmarkRouter = Router()

bookmarkRouter.post('/', accessTokenValidation, wrap(createBookmarkController))
bookmarkRouter.delete('/unbookmark-tweet/:tweet_id', accessTokenValidation, wrap(unBookmarkTweetController))

export default bookmarkRouter

import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { searchValidator } from '~/middlewares/search.middlewares'
import { paginationValidator } from '~/middlewares/tweet.middleware'
import { accessTokenValidation } from '~/middlewares/users.middlewares'

const searchRouter = Router()

searchRouter.get('/', accessTokenValidation, searchValidator, paginationValidator, searchController)

export default searchRouter

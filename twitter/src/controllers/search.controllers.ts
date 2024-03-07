import { NextFunction, Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/search.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import searchService from '~/services/search.services'

export const searchController = async (
  req: Request<ParamsDictionary, any, any, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await searchService.search({
    limit: limit,
    page: page,
    content: req.query.content,
    media_type: req.query.media_type,
    people_follow: req.query.people_follow,
    user_id: req.decoded_authorization?.user_id as string
  })

  res.json({
    message: 'Search Successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}

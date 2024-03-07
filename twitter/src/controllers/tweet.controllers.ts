import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { TweetType } from '~/constants/enums'
import HttpStatus from '~/constants/httpStatus'
import { TWEETS_MESSAGES, UsersMessages } from '~/constants/messages'
import { TweetRequestBody } from '~/models/requests/tweet.requests'
import { TokenJwtPayload } from '~/models/requests/user.requests'
import Tweet from '~/models/schemas/tweet.schema'
import tweetService from '~/services/tweet.services'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload
  const result = await tweetService.createTweet(req.body, user_id)
  return res.json({
    message: UsersMessages.SUCCESS,
    result: result
  })
}

export const getTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await tweetService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    user_views: result.user_views
  }
  return res.json({
    message: UsersMessages.SUCCESS,
    result: tweet
  })
}

export const getTweetChildrenController = async (req: Request, res: Response, next: NextFunction) => {
  const tweet_type = Number(req.query.tweet_type) as TweetType
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id

  const { total, tweets } = await tweetService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })

  return res.json({
    message: 'Get Tweet Children Successfully',
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await tweetService.getNewFeeds({
    user_id,
    limit,
    page
  })

  return res.json({
    message: 'Get New Feeds Successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}

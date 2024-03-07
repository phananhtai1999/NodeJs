import { Request, Response } from 'express'
import { LIKE_MESSAGES } from '~/constants/messages'
import { TokenJwtPayload } from '~/models/requests/user.requests'
import likeService from '~/services/like.services'

export const createLikeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload
  const { tweet_id } = req.body
  const result = await likeService.createlike(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGES.LIKE_SUCCESSFULLY,
    result: result
  })
}

export const unLikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload
  const { tweet_id } = req.params
  await likeService.unlikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGES.UNLIKE_SUCCESSFULLY
  })
}

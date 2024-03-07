import { Request, Response } from 'express'
import HttpStatus from '~/constants/httpStatus'
import { BOOKMARK_MESSAGES, UsersMessages } from '~/constants/messages'
import { TokenJwtPayload } from '~/models/requests/user.requests'
import bookmarkService from '~/services/bookmark.services'

export const createBookmarkController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload
  const { tweet_id } = req.body
  const result = await bookmarkService.createBookmark(user_id, tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY,
    result: result
  })
}

export const unBookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload
  const { tweet_id } = req.params
  await bookmarkService.unBookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGES.UNBOOKMARK_SUCCESSFULLY
  })
}

import Bookmark from '~/models/schemas/bookmark.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class BookmarkService {
  async createBookmark(user_id: string, tweet_id: string) {
    const data = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return data
  }

  async unBookmarkTweet(user_id: string, tweet_id: string) {
    // const data = await databaseService.bookmarks.findOne({
    //   user_id: new ObjectId(user_id),
    //   tweet_id: new ObjectId(tweet_id)
    // })

    // if (data !== null) {
    //   await databaseService.bookmarks.deleteOne({ _id: data._id })
    //   return true
    // }
    // return false

    const data = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    return data
  }
}

const bookmarkService = new BookmarkService()

export default bookmarkService

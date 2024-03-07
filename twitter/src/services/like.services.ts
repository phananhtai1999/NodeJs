import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Like from '~/models/schemas/like.schema'

class LikeService {
  async createlike(user_id: string, tweet_id: string) {
    const data = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
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

  async unlikeTweet(user_id: string, tweet_id: string) {
    // const data = await databaseService.likes.findOne({
    //   user_id: new ObjectId(user_id),
    //   tweet_id: new ObjectId(tweet_id)
    // })

    // if (data !== null) {
    //   await databaseService.likes.deleteOne({ _id: data._id })
    //   return true
    // }
    // return false

    const data = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    return data
  }
}

const likeService = new LikeService()

export default likeService

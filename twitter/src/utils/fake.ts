import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import { TweetRequestBody } from '~/models/requests/tweet.requests'
import { RegisterRequest } from '~/models/requests/user.requests'
import User from '~/models/schemas/user.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from './crypto'
import Follower from '~/models/schemas/follower.schema'
import Hashtag from '~/models/schemas/hashtag.schema'
import Tweet from '~/models/schemas/tweet.schema'

const PASSWORD = 'AnhTai19'

const MYID = new ObjectId('65dee4ce4965b09740f514b4')

const USER_COUNT = 300

const createRandomUser = () => {
  const user: RegisterRequest = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }

  return user
}

const createRandomTweet = () => {
  const tweet: TweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 100
    }),
    hashtags: ['NodeJS', 'MongoDB', 'Docker'],
    medias: [
      {
        type: MediaType.Image,
        url: faker.image.url()
      }
    ],
    mentions: [],
    parent_id: null
  }

  return tweet
}

const users: RegisterRequest[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insertMultipleUsers = async (users: RegisterRequest[]) => {
  console.log('Creating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          _id: user_id,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.Verified
        })
      )
      return user_id
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start followinhg...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) => {
      databaseService.followers.insertOne(
        new Follower({
          user_id,
          followed_user_id: followed_user_id
        })
      )
    })
  )
  console.log('Followed ${result.length} users successfully')
}

const checkAndCreateHashtags = async (hashtags: string[]) => {
  const hashtagDocuments = await Promise.all(
    hashtags.map((hashtag) => {
      return databaseService.hashtags.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: new Hashtag({ name: hashtag })
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
    })
  )
  return hashtagDocuments.map((hashtag) => hashtag?._id as ObjectId)
}

const insertTweet = async (user_id: ObjectId, body: TweetRequestBody) => {
  const hashtags = await checkAndCreateHashtags(body.hashtags)
  const result = await databaseService.tweets.insertOne(
    new Tweet({
      audience: body.audience,
      content: body.content,
      mentions: body.mentions,
      medias: body.medias,
      parent_id: body.parent_id,
      type: body.type,
      user_id: user_id,
      hashtags
    })
  )
  return result
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([insertTweet(id, createRandomTweet()), insertTweet(id, createRandomTweet())])
      count += 2
      console.log('Created ${count} Tweets')
    })
  )
  return result
}

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MYID), ids).catch((err) => {
    console.error('Error when following users')
    console.log(err)
  })
  insertMultipleTweets(ids).catch((err) => {
    console.error('Error when creating tweets')
    console.log(err)
  })
})

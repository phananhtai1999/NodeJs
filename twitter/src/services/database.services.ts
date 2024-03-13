import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/user.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import Follower from '~/models/schemas/follower.schema'
import VideoStatus from '~/models/schemas/videoStatus.schema'
import Tweet from '~/models/schemas/tweet.schema'
import Hashtag from '~/models/schemas/hashtag.schema'
import Bookmark from '~/models/schemas/bookmark.schema'
import Like from '~/models/schemas/like.schema'
import Conversation from '~/models/schemas/conversation.schema'
import { envConfig } from '~/constants/config'

const uri = `mongodb://${envConfig.dbHost}:27017/${envConfig.dbName}`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    console.log('test', uri)
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Connected')
    } catch (err) {
      console.log('Error', err)
      throw err
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1', 'email_1_password_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async indexTweets() {
    const exists = await this.users.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get users(): Collection<User> {
    return this.db.collection('users')
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refresh_tokens')
  }

  get followers(): Collection<Follower> {
    return this.db.collection('followers')
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection('video_status')
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection('tweets')
  }
  get hashtags(): Collection<Hashtag> {
    return this.db.collection('hashtags')
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection('bookmarks')
  }

  get likes(): Collection<Like> {
    return this.db.collection('likes')
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection('conversations')
  }
}

const databaseService = new DatabaseService()
export default databaseService

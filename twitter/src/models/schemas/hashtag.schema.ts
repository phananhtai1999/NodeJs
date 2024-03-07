import { ObjectId } from 'mongodb'
import { EncodingStatus } from '~/constants/enums'

interface HashtagType {
  _id?: ObjectId
  name: string
  created_at?: Date
}

export default class Hashtag {
  _id?: ObjectId
  name: string
  created_at?: Date

  constructor(hashtag: HashtagType) {
    this._id = hashtag._id || new ObjectId()
    this.name = hashtag.name
    this.created_at = hashtag.created_at || new Date()
  }
}

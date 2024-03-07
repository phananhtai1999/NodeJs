import e from 'express'

export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum MediaType {
  Image,
  Video,
  Hls
}

export enum EncodingStatus {
  Pending,
  Processing,
  Success,
  Faild
}

export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

export enum TweetAudience {
  Everyone,
  TweetCircle
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum PeopleFollow {
  Anyone = '0',
  Following = '1'
}

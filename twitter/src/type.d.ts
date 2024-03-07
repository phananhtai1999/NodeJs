import { TokenJwtPayload } from './models/requests/user.requests'
import Tweet from './models/schemas/tweet.schema'
import User from './models/schemas/user.schema'
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenJwtPayload
    decoded_refresh_token?: TokenJwtPayload
    decoded_email_verify_token?: TokenJwtPayload
    decoded_forgot_password_token?: TokenJwtPayload
    tweet?: Tweet
  }
}

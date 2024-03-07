import { ParamsDictionary } from 'express-serve-static-core'

export interface GetConversationParams extends ParamsDictionary {
  reciver_id: string
}

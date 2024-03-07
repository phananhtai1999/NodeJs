import { Request } from 'express'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessages } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from './jwt'
import dotenv from 'dotenv'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'

dotenv.config()

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatus({
      message: UsersMessages.ACCESS_TOKEN_IS_REQUESTED,
      status: HttpStatus.UNAUTHORIZED
    })
  }

  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
    if (req) {
      req.decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: capitalize((error as JsonWebTokenError).message),
      status: HttpStatus.UNAUTHORIZED
    })
  }
}

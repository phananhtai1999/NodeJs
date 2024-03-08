import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessages } from '~/constants/messages'
import { RegisterRequest, TokenJwtPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/user.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.status(200).json({
    message: UsersMessages.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequest>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.status(201).json({
    message: UsersMessages.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  await usersService.logout(refresh_token)

  return res.status(200).json({
    message: UsersMessages.LOGOUT_SUCCESS
  })
}

export const verifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenJwtPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: UsersMessages.USER_NOT_FOUND
    })
  }

  if (user.verify == UserVerifyStatus.Verified) {
    return res.status(200).json({
      message: UsersMessages.EMAIL_TOKEN_ALREADY_VERIFIED
    })
  }

  const result = await usersService.verifyEmailToken(user_id)

  return res.status(200).json({
    message: UsersMessages.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: UsersMessages.USER_NOT_FOUND
    })
  }

  if (user && user.verify == UserVerifyStatus.Verified) {
    return res.status(200).json({
      message: UsersMessages.EMAIL_TOKEN_ALREADY_VERIFIED
    })
  }
  await usersService.resendVerifyEmail(user_id)

  return res.status(200).json({
    message: UsersMessages.RESEND_EMAIL_VERIFY_SUCCESS
  })
}

export const forgetPasswordController = async (req: Request, res: Response) => {
  const { _id } = req.user as User
  const result = await usersService.forgetPassword((_id as ObjectId).toString())

  return res.status(200).json({
    message: UsersMessages.FORGOT_PASSWORD_SUCCESS
  })
}

export const verifyForgetPasswordController = async (req: Request, res: Response) => {
  const { forgot_password_token } = req.body
  const { user_id } = req.decoded_forgot_password_token as TokenJwtPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: UsersMessages.USER_NOT_FOUND
    })
  }

  if (user && user.forgot_password_token != forgot_password_token) {
    return res.status(200).json({
      message: UsersMessages.VERIFY_FORGOT_PASSWORD_TOKEN_INVALID
    })
  }

  return res.status(200).json({
    message: UsersMessages.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_forgot_password_token as TokenJwtPayload
  const { password } = req.body

  usersService.resetPassword(user_id, password)

  return res.status(200).json({
    message: UsersMessages.RESET_PASSWORD_SUCCESS
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenJwtPayload

  const result = await usersService.getMe(user_id)

  return res.status(200).json({
    message: UsersMessages.SUCCESS,
    result
  })
}

export const getUsernameController = async (req: Request, res: Response) => {
  const { username } = req.params

  const user = await usersService.getUserProfile(username)
  return res.status(200).json({
    message: UsersMessages.SUCCESS,
    result: user
  })
}

export const followUserController = async (req: Request, res: Response) => {
  const { followed_user_id } = req.body
  const { user_id } = req.decoded_authorization as TokenJwtPayload

  await usersService.followUser(user_id, followed_user_id)

  return res.status(200).json({
    message: UsersMessages.FOLLOW_USER_SUCCESS
  })
}

export const unfollowUserController = async (req: Request, res: Response) => {
  const { followed_user_id } = req.body
  const { user_id } = req.decoded_authorization as TokenJwtPayload

  await usersService.unfollowUser(user_id, followed_user_id)

  return res.status(200).json({
    message: UsersMessages.UNFOLLOW_USER_SUCCESS
  })
}

export const loginOauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await usersService.oauth(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&newUser=${result.newUser}&verify=${result.verify}`
  return res.redirect(urlRedirect)
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const { user_id } = req.decoded_refresh_token as TokenJwtPayload

  const result = await usersService.refreshToken({ user_id: user_id, refresh_token: refresh_token })

  return res.json({
    message: UsersMessages.REFRESH_TOKEN_SUCCESS,
    result
  })
}

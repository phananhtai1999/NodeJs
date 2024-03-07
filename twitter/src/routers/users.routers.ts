import { Router } from 'express'
import { UsersMessages } from '~/constants/messages'
import {
  followUserController,
  forgetPasswordController,
  getMeController,
  getUsernameController,
  loginController,
  loginOauthController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowUserController,
  verifyEmailController,
  verifyForgetPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  emailVerifyTokenValidation,
  followUserValidation,
  forgotPasswordValidation,
  loginValidator,
  refreshTokenValidation,
  registerValidator,
  resetPasswordValidation,
  verifyForgotPasswordTokenValidation
} from '~/middlewares/users.middlewares'
import { wrap } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/oauth/google', loginOauthController)
usersRouter.post('/register', registerValidator, wrap(registerController))
usersRouter.post('/logout', accessTokenValidation, refreshTokenValidation, wrap(logoutController))
usersRouter.post('/refresh-token', refreshTokenValidation, wrap(refreshTokenController))
usersRouter.post('/verify-email', emailVerifyTokenValidation, wrap(verifyEmailController))
usersRouter.post('/resend-verify-email', accessTokenValidation, wrap(resendVerifyEmailController))
usersRouter.post('/forgot-password', forgotPasswordValidation, wrap(forgetPasswordController))
usersRouter.post('/verify-forgot-password', verifyForgotPasswordTokenValidation, wrap(verifyForgetPasswordController))
usersRouter.post('/reset-password', resetPasswordValidation, wrap(resetPasswordController))
usersRouter.get('/get-me', accessTokenValidation, wrap(getMeController))
usersRouter.get('/:username', wrap(getUsernameController))
usersRouter.post('/follow', accessTokenValidation, followUserValidation, wrap(followUserController))
usersRouter.post('/unfollow', accessTokenValidation, followUserValidation, wrap(unfollowUserController))

export default usersRouter

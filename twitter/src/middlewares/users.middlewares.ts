import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessages } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

const forgotPasswordTokenSchema: ParamSchema = {
  notEmpty: {
    errorMessage: UsersMessages.FORGOT_PASSWORD_TOKEN_REQUIRED
  },
  custom: {
    options: async (value: string, { req }) => {
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })

        req.decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        throw new ErrorWithStatus({
          message: (error as JsonWebTokenError).message,
          status: HttpStatus.UNAUTHORIZED
        })
      }

      return true
    }
  }
}

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: UsersMessages.EMAIL_NOT_EMPTY
      },
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (user === null) {
            throw new ErrorWithStatus({ message: UsersMessages.USER_NOT_FOUND, status: 404 })
          }

          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: UsersMessages.PASSWORD_NOT_EMPTY
      },
      isString: true,
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: UsersMessages.PASSWORD_NOT_STRONG
      },
      errorMessage: 'Password is incorrect'
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: UsersMessages.NAME_NOT_EMPTY
      },
      isString: true,
      trim: true,
      isLength: {
        options: { min: 1, max: 100 }
      }
    },
    email: {
      notEmpty: {
        errorMessage: UsersMessages.EMAIL_NOT_EMPTY
      },
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value })
          if (user) {
            throw new ErrorWithStatus({ message: UsersMessages.EMAIL_ALREADY_EXISTS, status: 401 })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: UsersMessages.PASSWORD_NOT_EMPTY
      },
      isString: true,
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: UsersMessages.PASSWORD_NOT_STRONG
      },
      errorMessage: 'Password is incorrect'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new ErrorWithStatus({ message: UsersMessages.PASSWORD_NOT_MATCH, status: 401 })
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)

export const accessTokenValidation = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: UsersMessages.NAME_NOT_EMPTY
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (access_token === '') {
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
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HttpStatus.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidation = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: UsersMessages.REFRESH_TOKEN_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ])

              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: UsersMessages.REFRESH_TOKEN_USED_OR_NOT_EXSITS,
                  status: HttpStatus.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: UsersMessages.REFRESH_TOKEN_INVALID,
                  status: HttpStatus.UNAUTHORIZED
                })
              }

              throw error
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidation = validate(
  checkSchema(
    {
      email_verify_token: {
        notEmpty: {
          errorMessage: UsersMessages.EMAIL_VERIFY_TOKEN_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })

              req.decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HttpStatus.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidation = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: UsersMessages.EMAIL_NOT_EMPTY
        },
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user === null) {
              throw new ErrorWithStatus({
                message: UsersMessages.REFRESH_TOKEN_USED_OR_NOT_EXSITS,
                status: HttpStatus.UNAUTHORIZED
              })
            }

            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidation = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidation = validate(
  checkSchema(
    {
      forgot_password_token: {
        notEmpty: {
          errorMessage: UsersMessages.FORGOT_PASSWORD_TOKEN_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const decoded_forgot_password_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })

              req.decoded_forgot_password_token = decoded_forgot_password_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HttpStatus.UNAUTHORIZED
              })
            }

            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: UsersMessages.PASSWORD_NOT_EMPTY
        },
        isString: true,
        trim: true,
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: UsersMessages.PASSWORD_NOT_STRONG
        },
        errorMessage: 'Password is incorrect'
      },
      confirm_password: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new ErrorWithStatus({ message: UsersMessages.PASSWORD_NOT_MATCH, status: 401 })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const followUserValidation = validate(
  checkSchema(
    {
      followed_user_id: {
        notEmpty: {
          errorMessage: UsersMessages.USER_ID_IS_REQUESTED
        },
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
            if (user == null) {
              throw new ErrorWithStatus({
                message: UsersMessages.USER_NOT_FOUND,
                status: HttpStatus.UNPROCESSABLE_ENTITY
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const isUserLoggedInValidator = (middleware: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return middleware(req, res, next)
    }
    next()
  }
}

export const UsersMessages = {
  VALIDATETION_ERRROR: 'Validation error',
  NAME_NOT_EMPTY: 'Name is not empty',
  EMAIL_NOT_EMPTY: 'Email is not empty',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_NOT_EMPTY: 'Password is not empty',
  PASSWORD_NOT_STRONG: 'Password is not strong',
  PASSWORD_NOT_MATCH: 'Passwords do not match',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  USER_NOT_FOUND: 'User not found',
  ACCESS_TOKEN_IS_REQUESTED: 'Access token is requested',
  LOGOUT_SUCCESS: 'Log out successfully',
  REFRESH_TOKEN_REQUIRED: 'Refresh token required',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_USED_OR_NOT_EXSITS: 'Refresh token is used or not',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token is not found',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token required',
  EMAIL_VERIFY_TOKEN_INVALID: 'Email verify token is invalid',
  EMAIL_TOKEN_ALREADY_VERIFIED: 'Email token already verified',
  EMAIL_VERIFY_SUCCESS: 'Email token verifY success',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Resend email verify token successfully',
  FORGOT_PASSWORD_SUCCESS: 'Forgot password successfully',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password is required',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token successfully',
  VERIFY_FORGOT_PASSWORD_TOKEN_INVALID: 'Verify forgot password token invalid',
  RESET_PASSWORD_SUCCESS: 'Reset password token invalid',
  SUCCESS: 'success',
  USER_ID_IS_REQUESTED: 'user id is requested',
  FOLLOW_USER_SUCCESS: 'Follow user successfully',
  YOU_ALREADY_FOLLOWED_USER: 'You already followed user',
  YOU_NOT_FOLLOWED_USER: 'You have not followed user yet',
  UNFOLLOW_USER_SUCCESS: 'Unfollow user successfully',
  GMAIL_NOT_VERIFIED: 'Gmail is not verified',
  UPLOAD_IMAGE_SUCCESS: 'Upload image successfully',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully'
} as const

export const TWEETS_MESSAGES = {
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent id must be a valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  INVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_NOT_FOUND: 'Tweet not found',
  TWEET_IS_NOT_PUBLIC: 'Tweet is not public'
} as const

export const BOOKMARK_MESSAGES = {
  BOOKMARK_SUCCESSFULLY: 'Bookmark successfully',
  UNBOOKMARK_SUCCESSFULLY: 'Unbookmark successfully'
} as const

export const LIKE_MESSAGES = {
  LIKE_SUCCESSFULLY: 'Like successfully',
  UNLIKE_SUCCESSFULLY: 'Unlike successfully'
} as const

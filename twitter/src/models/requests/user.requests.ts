import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterRequest {
  name: string
  password: string
  confirm_password: string
  email: string
  date_of_birth: string
}

export interface TokenJwtPayload extends JwtPayload {
  user_id: string
  type: TokenType
  exp: number
  iat: number
}

import { Middleware, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { authErrors } from './auth.errors'
import { UserService } from '../../modules/user/user.service'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'

@Middleware()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: ConfigService,
    private userService: UserService
  ) {}
  resolve () {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
        let token = (req.headers.authorization as string).split(' ')[1]
        const decoded: any = jwt.verify(token, this.config.jwt.secret)
        const identity = {
          id: decoded.id,
          email: decoded.email
        }

        const user = await this.userService.findOne(identity)

        if (!user) throw new ErrorMessage('auth:unauthorized')

        this.userService.user = user

        next()
      } else {
        throw new ErrorMessage('auth:unauthorized')
      }
    }
  }
}

ErrorMessage.addErrorMessages(authErrors)


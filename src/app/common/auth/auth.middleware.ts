import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { UserService } from '../../modules/user/user.service'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: ConfigService,
    private userService: UserService
  ) {}
  resolve () {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.header('authorization')

      if (authorization && authorization.split(' ')[0] === 'Bearer') {
        let token = authorization.split(' ')[1]
        const decoded: any = jwt.verify(token, (this.config as any).jwt.secret)
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

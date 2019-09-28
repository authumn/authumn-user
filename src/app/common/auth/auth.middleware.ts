import {
  Injectable,
  NestMiddleware
} from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { UserServiceMongo } from '../../modules/user/services/user.service.mongo'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: ConfigService,
    private userService: UserServiceMongo
  ) {}
  // NestJS 5.1 return types are weird so fixed with any
  resolve (): any {
    return async (
      request: Request,
      response: Response,
      next: NextFunction
    ): Promise<any> => {
      const authorization = request.header('authorization')

      if (
        authorization &&
        authorization.split(' ')[0] === 'Bearer'
      ) {
        const token = authorization.split(' ')[1]

        const decoded: any = jwt.verify(
          token,
          (this.config as any).jwt.secret
        )

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

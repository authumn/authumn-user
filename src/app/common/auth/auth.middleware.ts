import {
  Injectable,
  NestMiddleware
} from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'
import { IUserService } from '../../modules/user/interfaces/IUserService'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: ConfigService,
    private userService: IUserService
  ) {}
  // NestJS 5.1 return types are weird so fixed with any
  async use (
      request: Request,
      response: Response,
      next: NextFunction
    ) {
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

      const user = await this.userService.findById(decoded.sub)

      if (!user) throw new ErrorMessage('auth:unauthorized')

      this.userService.user = user

      next()
    } else {
      throw new ErrorMessage('auth:unauthorized')
    }
  }
}

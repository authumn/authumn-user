import {
  CanActivate,
  Injectable,
  ExecutionContext
} from '@nestjs/common'
import { ErrorMessage } from '@nestling/errors'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestling/config'
import { setContext } from '@nestling/context'
import { UserServiceMongo } from '../../modules/user/services/user.service.mongo'

export type JWTConfig = {
  jwt: {
    contextKey?: string
    secret: string
    header?: string
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private config: ConfigService,
    private userService: UserServiceMongo
  ) {}

  async canActivate (executionContext: ExecutionContext): Promise<boolean> {
    const {
      jwt: {
        contextKey = 'jwt',
        secret,
        header = 'authorization'
      }
    }: JWTConfig = this.config as any

    const httpContext = executionContext.switchToHttp()
    const request = httpContext.getRequest()
    const { headers } = request

    if (typeof headers[header] === 'string') {
      const parts = headers[header].split(' ')

      if (parts[0] === 'Bearer') {
        const token = parts[1]
        const decoded: any = jwt.verify(token, secret)

        const user = await this.userService.findById(decoded.sub)

        if (!user) throw new ErrorMessage('auth:unauthorized')

        this.userService.user = user

        setContext(contextKey, decoded, request)

        return true
      }
    }

    throw new ErrorMessage('auth:unauthorized')
  }
}

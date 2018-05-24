import {
  CanActivate,
  Injectable,
  ExecutionContext
} from '@nestjs/common'
import { ErrorMessage } from '@nestling/errors'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestling/config'
import { Context } from '@nestling/context'
import { UserService } from '../../modules/user/user.service'

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
    private context: Context,
    private userService: UserService
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
    const { headers } = httpContext.getRequest()

    if (typeof headers[header] === 'string') {
      const parts = headers[header].split(' ')

      if (parts[0] === 'Bearer') {
        const token = parts[1]
        const decoded: any = jwt.verify(token, secret)

        const identity = {
          id: decoded.id,
          email: decoded.email
        }

        const user = await this.userService.findOne(identity)

        if (!user) throw new ErrorMessage('auth:unauthorized')

        this.context.set(contextKey, decoded)

        return true
      }
    }

    throw new ErrorMessage('auth:unauthorized')
  }
}

import {
  Bind,
  Body,
  Controller,
  Get,
  HttpStatus, OnModuleInit,
  Param,
  Post,
  Put,
  Response,
  UseGuards
} from '@nestjs/common'

import {
  Client,
  GrpcMethod,
  ClientGrpc
} from '@nestjs/microservices'

import { UserMap, User } from './models'
import { ValidatorService } from '@nestling/validator'
import { LoggedInUser, RegisteredUser } from '../../schemas'
import { AuthGuard } from '../../common/auth'
import { ErrorMessage } from '@nestling/errors'
import { PasswordService } from './password.service'
import { ResponseMessage } from '@nestling/messages'
import { SendEmailSuccessPayload } from './user.messages'
import { grpcClientOptions } from '../../grpc-client-options'
import { Observable } from 'rxjs'
import { fromPromise } from 'rxjs/internal/observable/fromPromise'
import { IUserService } from './interfaces/IUserService'

export interface GrpcUserService {
  Preload(): Observable<any>;
  GetUsername(): Observable<any>;
}

export interface LostPasswordPayload {
  email?: string
  login?: string
}

@Controller('user')
export class UserController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client!: ClientGrpc
  private grpcUserService!: GrpcUserService

  constructor(
    private readonly userService: IUserService,
    private readonly passwordService: PasswordService,
    private readonly validatorService: ValidatorService
  ) {}

  onModuleInit () {
    this.grpcUserService = this.client.getService<GrpcUserService>('UserService')
  }

  /**
   * Authenticates a user using the userService.
   *
   * @param {User} user
   * @param {Response} response
   * @returns {Promise<void>}
   */
  @Post('/login')
  @Bind(Body())
  async loginUser(
    user: LoggedInUser,
    @Response() response
  ) {
    await this.validatorService.validate('login', user)

    const { login, password } = user

    const result = await this.userService.authenticate(login, password)

    return response
      .status(HttpStatus.ACCEPTED)
      .json(result)
  }

  /**
   * Register a user using the userService.
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  @Post('/register')
  @Bind(Body())
  async registerUser(user: User): Promise<User> {
    await this.validatorService.validate('registration', user)

    const { email, password, ...rest } = user as RegisteredUser

    return this.userService.register(email, password, rest)
  }

  @Get('/list')
  @UseGuards(AuthGuard)
  async listUsers (): Promise<User[]> {
    return this.userService.listUsers()
  }

  @Put()
  @Bind(Body())
  @UseGuards(AuthGuard)
  async updateUser (user: User): Promise<User> {
    return this.userService.update(user)
  }

  @Get('/:id')
  @Bind(Param('id'))
  @UseGuards(AuthGuard)
  async findById (id: string): Promise<User> {
    const user: any = this.userService.findById(id)

    if (user) {
      return user
    }

    throw new ErrorMessage('user:notFound')
  }

  // Password
  @Put('/password')
  @Bind(Body())
  @UseGuards(AuthGuard)
  async updatePassword (body): Promise<User> {
    return this.userService.updatePassword(body.password)
  }

  @Get('/reset_token')
  async resetToken() {

  }

  @Post('/reset_password')
  async resetPassword() {

  }

  @Post('/forgot_password')
  @Bind(Body())
  async forgotPassword(body: LostPasswordPayload): Promise<SendEmailSuccessPayload> {
    let user

    if (body.email) {
      user = await this.userService.findByEmail(body.email)
    } else if (body.login) {
      user = await this.userService.findByUsername(body.login)
    }

    if (user)  {
      const reply = await this.passwordService.sendLostPasswordEmail(user)

      // TODO: just also send the code back + payload. code can be type.
      return new ResponseMessage('user:sendEmailSuccess', reply)
    }

    throw new ErrorMessage('user:notFound')
  }

  @GrpcMethod('UserService')
  preload(): Observable<UserMap[]> {
    return fromPromise(this.userService.idAndNamelist())
  }

  @GrpcMethod('UserService')
  getUsername({id}): Observable<UserMap> {
    return fromPromise(
      this.userService.findById(id).then((user) => {
        if (user) {
          return {
            id: user.id,
            name: user.username
          } as UserMap
        }

        throw new ErrorMessage('user:notFound')
      })
    )
  }

  @GrpcMethod('UserService')
  getId({name}): Observable<UserMap> {
    return fromPromise(
      this.userService.findByUsername(name).then((user) => {
        if (user) {
          return {
            id: user.id,
            name: user.username
          } as UserMap
        }

        throw new ErrorMessage('user:notFound')
      })
    )
  }
}

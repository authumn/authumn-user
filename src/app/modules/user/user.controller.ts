import {
  Bind,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Response,
  UseFilters,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './models'
import { ValidatorService } from '@nestling/validator'
import { LoggedInUser, RegisteredUser } from '../../schemas'
import { AuthGuard } from '../../common/auth'
import { ErrorMessage, HttpExceptionFilter } from '@nestling/errors'
import { PasswordService } from './password.service'
import { ResponseMessage } from '@nestling/messages'
import { SendEmailSuccessPayload } from './user.messages'

export interface LostPasswordPayload {
  email?: string
  login?: string
}

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly validatorService: ValidatorService
  ) {}

  /**
   * Authenticates a user using the userService.
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  @Post('/login')
  @Bind(Body())
  async loginUser(
    user: User,
    @Response() response
  ) {
    await this.validatorService.validate('login', user)

    const { email, password } = user as LoggedInUser

    const result = await this.userService.authenticate(email, password)

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
    return this.userService.findById(id)
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
    const user = await this.userService.findByEmail(body.email)

    if (user)  {
      const reply = await this.passwordService.sendLostPasswordEmail(user)

      // TODO: just also send the code back + payload. code can be type.
      return new ResponseMessage<SendEmailSuccessPayload>('user:sendEmailSuccess', reply)
    }

    throw new ErrorMessage('user:notFound')
  }
}

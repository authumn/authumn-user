import {
  Bind,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Response, UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './models'
import { ValidatorService } from '@nestling/validator'
import { LoggedInUser, RegisteredUser } from '../../schemas'
import { AuthGuard } from '../../common/auth'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
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

    const { email, password } = user as RegisteredUser

    return this.userService.register(email, password)
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

  @Get('/:_id')
  @Bind(Param('_id'))
  @UseGuards(AuthGuard)
  async findById (_id: string): Promise<User> {
    return this.userService.findById(_id)
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
  async forgotPassword() {

  }
}

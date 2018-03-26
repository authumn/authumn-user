import {
  Bind,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Response
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './models'
import { ValidatorService } from '@nestling/validator'
import { PasswordService } from './password.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly validatorService: ValidatorService,
    private readonly passwordService: PasswordService
  ) {

  }

  /**
   * Authenticates a user using the userService.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   */
  @Post('/login')
  @Bind(Body())
  async loginUser(user: User, @Response() response) {
    await this.validatorService.validate('login', user)

    const { email, password } = user

    const result = await this.userService.authenticate(email, password)

    return response
      .status(HttpStatus.ACCEPTED)
      .json(result)
  }

  /**
   * Register a user using the userService.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   */
  @Post('/register')
  @Bind(Body())
  async registerUser(user: User) {
    await this.validatorService.validate('registration', user)

    const { email, password } = user

    return this.userService.register(email, password)
  }

  @Get('/list')
  async listUsers () {
    return this.userService.listUsers()
  }

  @Put()
  @Bind(Body())
  async updateUser (user: User) {
    return this.userService.update(user)
  }

  @Get('/:_id')
  @Bind(Param('_id'))
  async findById (_id: string) {
    return this.userService.findById(_id)
  }

  // Password
  @Put('/password')
  @Bind(Body())
  async updatePassword (body) {
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

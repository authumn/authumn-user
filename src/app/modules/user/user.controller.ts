import {
  Controller,
  Body,
  Param,
  Post,
  Put,
  Bind,
  Response,
  Get, HttpStatus
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './models'
import { ValidatorService } from '../../shared/validator/validator.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly validatorService: ValidatorService
  ) {}

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

    console.log('loginUser:', result, email, password)

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

    console.log('validated?')

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
}

import {
  Controller,
  Body,
  Param,
  Post,
  Put,
  Bind,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './models'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Authenticates a user using the userService.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   */
  @Post('/login')
  @Bind(Body())
  async loginUser(user: User) {
    if (user) {
      const { email, password } = user

      if (!email || !password) {
        return new Error('email or password missing')
      }

      const result = await this.userService.authenticate(email, password)

      console.log('loginUser:', result, email, password)

      return result
    } else {
      throw Error('User empty')
    }
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
    const { email, password } = user

    if (!email || !password) {
      return new Error('email or password missing')
    }

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

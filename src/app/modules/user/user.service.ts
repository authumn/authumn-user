import { Injectable } from '@nestjs/common'
import { User } from './models'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import * as bcrypt from 'bcrypt'
import { PasswordService } from './password.service'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'

@Injectable()
export class UserService {
  private _user!: User

  constructor(
    private config: ConfigService,
    private adapter: MongoDbAdapter,
    private passwordService: PasswordService
  ) {}

  set user(user: User) {
    this._user = user
  }

  get user (): User {
    return this._user
  }

  async updatePassword(password: string): Promise<User> {
    return this.adapter.update({
      _id: this.user._id as string,
      password: await this.passwordService.hash(password)
    })
  }

  /**
   * Authenticate user by providing email and password.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email)

    if (user) {
      const match = await bcrypt.compare(password, user.password as string)

      if (match) {
        return {
          _id: (user._id as string),
          email: user.email
        }
      }
    }

    throw new ErrorMessage('user:credentialsInvalid')
  }

  /**
   * Find a user by it's id and email
   *
   * @param {string} id
   * @returns {Promise<User | undefined>}
   */
  async findOne(where: any): Promise<User> {
    return this.adapter.findOne(where)
  }

  /**
   * Find a user by it's id
   *
   * @param {string} id
   * @returns {Promise<User | undefined>}
   */
  async findById(id: string): Promise<User> {
    return this.adapter.findById(id)
  }

  /**
   * Find a user by it's email
   *
   * @param {string} id
   * @returns {Promise<User>}
   */
  async findByEmail(email: string): Promise<User> {
    return this.adapter.findOne({
      email
    })
  }

  /**
   * List all users
   *
   * @returns {Promise<User[]>}
   */
  async listUsers(): Promise<User[]> {
    return this.adapter.findAll()
  }

  /**
   * Update a user.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async update(user: User): Promise<User> {
    return this.adapter.update(user)
  }

  /**
   * Register a user.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async register(email: string, password: string): Promise<User> {
    return this.createUser(email, password)
  }

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, (this.config as any).saltRounds)

    return this.adapter.insert({
      email,
      password: hashedPassword
    })
  }
}

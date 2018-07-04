import { Injectable } from '@nestjs/common'
import { OwnerMap, User } from './models'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import * as bcrypt from 'bcrypt'
import { PasswordService } from './password.service'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'
import { LostPasswordPayload } from './user.controller'

@Injectable()
export class UserService {
  private _user!: User

  constructor(
    private config: ConfigService,
    private adapter: MongoDbAdapter,
    private passwordService: PasswordService
  ) {

  }

  set user(user: User) {
    this._user = user
  }

  get user (): User {
    return this._user
  }

  async updatePassword(newPassword: string): Promise<User> {
    const password = await this.passwordService.hash(newPassword)

    return this.adapter.update({
      id: this.user.id as string,
      password
    })
  }

  /**
   * Authenticate user by providing email and password.
   *
   * @param {string} login Email or username
   * @param {string} password
   * @returns {Promise<User>}
   */
  async authenticate(login: string, password: string): Promise<User> {
    let user

    user = await this.findByEmail(login)

    if (!user) {
      user = await this.findByUsername(login)
    }

    if (user) {
      const match = await bcrypt.compare(password, user.password as string)

      if (match) {
        return {
          id: (user.id as string),
          email: user.email,
          username: user.username
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
   * Find a user by it's username
   *
   * @param {string} id
   * @returns {Promise<User>}
   */
  async findByUsername(username: string): Promise<User> {
    return this.adapter.findOne({
      username
    })
  }

  /**
   * List all users
   *
   * @returns {Promise<User[]>}
   */
  async listUsers(): Promise<User[]> {
    const result = await this.adapter.find({})

    return result.toArray()
  }

  async idAndNamelist(): Promise<OwnerMap[]> {
    const result = await this.adapter.find({}, {
      _id: 0,
      id: 1,
      name: 1
    })

    const list = await (result as any).map((user) => ({
      id: user.id,
      name: user.username
    })).toArray()

    return list
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
  async register(email: string, password: string, additionalInfo: any = {}): Promise<User> {
    return this.createUser(email, password, additionalInfo)
  }

  async createUser(email: string, password: string, additionalInfo: any = {}): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, (this.config as any).saltRounds)

    const user = {
      email,
      password: hashedPassword,
      ...additionalInfo
    }

    return this.adapter.insert(user)
  }
}

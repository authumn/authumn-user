import { Component, Inject } from '@nestjs/common';
import { User } from './models'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import * as bcrypt from 'bcrypt'
import { environment } from '../../../environments/environment'

const saltRounds = environment.saltRounds

@Component()
export class UserService {
  constructor(
    private adapter: MongoDbAdapter
  ) {}

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
      const match = await bcrypt.compare(password, user.password)

      if (match) {
        return {
          _id: user._id.toString(),
          email: user.email
        }
      }
    }

    throw Error('Not Authenticated')
  }

  /**
   * Find a user by it's id
   *
   * @param {string} id
   * @returns {Promise<User | undefined>}
   */
  async findById(id: string) {
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
  async listUsers() {
    return this.adapter.findAll()
  }

  /**
   * Update a user.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async update(user: User) {
    return this.adapter.update(user)
  }

  /**
   * Register a user.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return this.adapter.insert({
      email,
      password: hashedPassword
    })
  }
}

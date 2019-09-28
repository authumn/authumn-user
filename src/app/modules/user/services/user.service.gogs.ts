import { Injectable } from '@nestjs/common'
import { UserMap, User } from '../models'
import { ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'
import { IUserService } from '../interfaces/IUserService'
import * as request from 'superagent'

/**
 * Replacement service interacting with the gogs server.
 */
@Injectable()
export class UserServiceGogs implements IUserService {
  private _user!: User
  private readonly apiUrl: string
  private readonly apiKey: string

  constructor(private config: ConfigService) {
    this.apiUrl = (config as any).gogs.api.url
    this.apiKey = (config as any).gogs.api.key
  }

  set user(user: User) {
    this._user = user
  }

  get user (): User {
    return this._user
  }

  async updatePassword(_newPassword: string): Promise<User> {
    throw Error('NOT IMPLEMENTED')
  }

  get agent (){
    return (request as any).agent()
      .set('Authorization', `token ${this.apiKey}`)
  }

  /**
   * Authenticate user by providing email and password.
   *
   * @param {string} login Email or username
   * @param {string} password
   * @returns {Promise<User>}
   */
  async authenticate(login: string, password: string): Promise<User> {
    const gogsRegisterUrl = `${this.apiUrl}/admin/users/authenticate`

    const response = await this.agent
      .post(`${gogsRegisterUrl}`)
      .send({
        username: login,
        password: password
      })

    if (response.status === 200) {
      return response.body
    }

    throw new ErrorMessage('user:credentialsInvalid')
  }

  /**
   * Find a user by it's id
   *
   * @param {string} id
   * @returns {Promise<User | undefined>}
   */
  async findById(id: string): Promise<User | null> {
    const gogsUserUrl = `${this.apiUrl}/admin/users/${id}`

    const response = await this.agent
      .get(`${gogsUserUrl}`)

    if (response.status === 200) {
      return response.body
    }

    return null
  }

  /**
   * Find a user by it's email
   *
   * @param {string} _email
   * @returns {Promise<User | null>}
   */
  async findByEmail(_email: string): Promise<User | null> {
    throw Error('NOT IMPLEMENTED')
  }

  /**
   * Find a user by it's username
   *
   * @param {string} username
   * @returns {Promise<User>}
   */
  async findByUsername(username: string): Promise<User | null> {
    const gogsUserUrl = `${this.apiUrl}/admin/users/${username}`

    const response = await this.agent
      .get(`${gogsUserUrl}`)

    if (response.status === 200) {
      return response.body
    }

    return null
  }

  /**
   * List all users
   *
   * @returns {Promise<User[]>}
   */
  async listUsers(): Promise<User[]> {
    const gogsUserListUrl = `${this.apiUrl}/admin/users`

    const response = await this.agent
      .get(`${gogsUserListUrl}`)

    if (response.status === 200) {
      return response.body
    }

    throw new ErrorMessage('user:notFound')
  }

  async idAndNamelist(): Promise<UserMap[]> {
    const users = await this.listUsers()

    return users.map(({id, username: name}) => ({ id, name } as UserMap))
  }

  /**
   * Update a user.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async update(user: User): Promise<User> {
    const gogsEditUserUrl = `${this.apiUrl}/admin/users/${user.username}`

    const allowedFields = [
      'full_name',
      'website',
      'location'
    ]

    const updates = {}

    for(const field of allowedFields)  {
      if (user[field]) {
        updates[field] = user[field]
      }
    }

    const response = await this.agent
      .post(`${gogsEditUserUrl}`)
      .send(updates)

    if (response.status === 200) {
      return {
        id: response.body.id,
        email: response.body.email,
        username: response.body.username,
        avatar_url: response.body.avatar_url
      }
    }

    throw new ErrorMessage('user:notFound')
  }

  /**
   * Register a user.
   *
   * @param {string} email
   * @param {string} password
   * @param {any} additionalInfo
   * @returns {Promise<User>}
   */
  async register(email: string, password: string, additionalInfo: any = {}): Promise<User> {
    const gogsRegisterUrl = `${this.apiUrl}/admin/users`

    const response = await this.agent
      .post(`${gogsRegisterUrl}`)
      .send({
        username: additionalInfo.username,
        email,
        password
        // send_notify: true (TODO: enable this)
      })

    if (response.status === 200) {
      return {
        id: response.body.id,
        email: response.body.email,
        username: response.body.username,
        avatar_url: response.body.avatar_url
      }
    }

    throw new ErrorMessage('user:missingData')
  }
}

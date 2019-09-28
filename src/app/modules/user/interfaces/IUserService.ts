import { UserMap, User } from '../models'

export abstract class IUserService {
  abstract set user(user: User)

  abstract get user (): User

  abstract updatePassword(newPassword: string): Promise<User>

  /**
   * Authenticate user by providing email and password.
   *
   * @param {string} login Email or username
   * @param {string} password
   * @returns {Promise<User>}
   */
  abstract authenticate(login: string, password: string): Promise<User>

  /**
   * Find a user by it's id
   *
   * @param {string} id
   * @returns {Promise<User | null>}
   */
  abstract findById(id: string): Promise<User | null>

  /**
   * Find a user by it's email
   *
   * @param {string} email
   * @returns {Promise<User | null>}
   */
  abstract findByEmail(email: string): Promise<User | null>

  /**
   * Find a user by it's username
   *
   * @param {string} username
   * @returns {Promise<User | null>}
   */
  abstract findByUsername(username: string): Promise<User | null>

  /**
   * List all users
   *
   * @returns {Promise<User[]>}
   */
  abstract listUsers(): Promise<User[]>

  abstract idAndNamelist(): Promise<UserMap[]>

  /**
   * Update a user.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  abstract update(user: User): Promise<User>

  /**
   * Register a user.
   *
   * @param {string} email
   * @param {string} password
   * @param {any} additionalInfo
   * @returns {Promise<User>}
   */
  abstract register(email: string, password: string, additionalInfo?: any): Promise<User>
}

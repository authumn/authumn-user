import { UserMap, User } from '../models'

export interface IUserService {
  /* This is ugly not sure if needed.
  set user(user: User) {
    this._user = user
  }

  get user (): User {
    return this._user
  }
  */

  updatePassword(newPassword: string): Promise<User>

  /**
   * Authenticate user by providing email and password.
   *
   * @param {string} login Email or username
   * @param {string} password
   * @returns {Promise<User>}
   */
  authenticate(login: string, password: string): Promise<User>

  /**
   * Find a user by it's id
   *
   * @param {string} id
   * @returns {Promise<User | undefined>}
   */
  findById(id: string): Promise<User | null>

  /**
   * Find a user by it's email
   *
   * @param {string} id
   * @returns {Promise<User>}
   */
  findByEmail(email: string): Promise<User | null>

  /**
   * Find a user by it's username
   *
   * @param {string} id
   * @returns {Promise<User>}
   */
  findByUsername(username: string): Promise<User | null>

  /**
   * List all users
   *
   * @returns {Promise<User[]>}
   */
  listUsers(): Promise<User[]>

  idAndNamelist(): Promise<UserMap[]>

  /**
   * Update a user.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  update(user: User): Promise<User>

  /**
   * Register a user.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  register(email: string, password: string, additionalInfo?: any): Promise<User>
}

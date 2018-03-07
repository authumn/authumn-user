import {User} from '../models'

export interface IUserDbAdapter {
  find: (by) => Promise<User[]>
  findOne: (by) => Promise<User>
  insert: (user: User) => Promise<User>
  findById: (id: string) => Promise<User>
  update: (user: User) => Promise<User>
  findAll: () => Promise<User[]>
}

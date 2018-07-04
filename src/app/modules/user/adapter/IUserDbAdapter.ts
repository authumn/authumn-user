import {User} from '../models'
import { Cursor, FilterQuery, FindOneOptions } from 'mongodb'

export interface IUserDbAdapter {

  find<T = any>(query: FilterQuery<any>, options?: any): Promise<Cursor<T>>
  findOne: (by) => Promise<User>
  insert: (user: User) => Promise<User>
  findById: (id: string) => Promise<User>
  update: (user: User) => Promise<User>
  findAll: () => Promise<User[]>
}

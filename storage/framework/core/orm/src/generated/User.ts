import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import type { Result } from '@stacksjs/error-handling'
import { err, handleError, ok } from '@stacksjs/error-handling'
import { db } from '@stacksjs/query-builder'

// import { Kysely, MysqlDialect, PostgresDialect } from 'kysely'
// import { Pool } from 'pg'

// TODO: we need an action that auto-generates these table interfaces
export interface UsersTable {
  // Columns that are generated by the database should be marked
  // using the `Generated` type. This way they are automatically
  // made optional in inserts and updates.
  id: Generated<number>
  name: string
  email: string
  // If the column is nullable in the database, make its type nullable.
  // Don't use optional properties. Optionality is always determined
  // automatically by Kysely.
  password: string
  // You can specify a different type for each operation (select, insert and
  // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
  // wrapper. Here we define a column `created_at` that is selected as
  // a `Date`, can optionally be provided as a `string` in inserts and
  // can never be updated:
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  deleted_at: ColumnType<Date, string | undefined, never>
}

export type UserType = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export class UserModel {
  private userData: Partial<UserType>

  // TODO: this hidden functionality needs to be implemented still
  private hidden = ['password']

  constructor(userData: Partial<UserType>) {
    this.userData = userData
  }

  // Method to find a user by ID
  static async find(id: number): Promise<UserModel | null> {
    const userData = await db.selectFrom('users')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()

    if (!userData)
      return null

    return new UserModel(userData)
  }

  // Method to get a user by criteria
  static async get(criteria: Partial<UserType>): Promise<UserModel[]> {
    if (criteria.id !== undefined) {
      const users = await db.selectFrom('users')
        .where('id', '=', criteria.id)
        .selectAll()
        .execute()
      return users.map(user => new UserModel(user))
    }

    return []
  }

  // Method to get all users
  static async all(): Promise<UserModel[]> {
    const users = await db.selectFrom('users')
      .selectAll()
      .execute()

    return users.map(user => new UserModel(user))
  }

  // Method to create a new user
  static async create(newUser: NewUser): Promise<UserModel> {
    const user = await db.insertInto('users')
      .values(newUser)
      .returningAll()
      .executeTakeFirstOrThrow()

    return new UserModel(user)
  }

  // Method to update a user
  static async update(id: number, userUpdate: UserUpdate): Promise<UserModel> {
    const user = await db.updateTable('users')
      .set(userUpdate)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()

    return new UserModel(user)
  }

  // Method to remove a user
  static async remove(id: number): Promise<UserModel> {
    const user = await db.deleteFrom('users')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()

    return new UserModel(user)
  }

  // Method to find a user by email
  static async findByEmail(email: string): Promise<UserModel | null> {
    const userData = await db.selectFrom('users')
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst()

    if (!userData)
      return null

    return new UserModel(userData)
  }

  async where(criteria: Partial<UserType>) {
    let query = db.selectFrom('users')
    if (criteria.id)
      query = query.where('id', '=', criteria.id) // Kysely is immutable, we must re-assign
    if (criteria.email)
      query = query.where('email', '=', criteria.email)
    if (criteria.name !== undefined) {
      query = query.where(
        'name',
        criteria.name === null ? 'is' : '=',
        criteria.name,
      )
    }
    if (criteria.password)
      query = query.where('password', '=', criteria.password)
    if (criteria.created_at)
      query = query.where('created_at', '=', criteria.created_at)
    if (criteria.updated_at)
      query = query.where('updated_at', '=', criteria.updated_at)
    if (criteria.deleted_at)
      query = query.where('deleted_at', '=', criteria.deleted_at)
    return await query.selectAll().execute()
  }

  async first() {
    return await db.selectFrom('users')
      .selectAll()
      .executeTakeFirst()
  }

  async last() {
    return await db.selectFrom('users')
      .selectAll()
      .orderBy('id', 'desc')
      .executeTakeFirst()
  }

  // Method to get the user instance itself
  self() {
    return this
  }

  // Method to get the user instance data
  get() {
    return this.userData
  }

  // Method to update the user instance
  async update(userUpdate: UserUpdate): Promise<Result<UserType, Error>> {
    if (this.userData.id === undefined)
      return err(handleError('User ID is undefined'))

    const updatedUser = await db.updateTable('users')
      .set(userUpdate)
      .where('id', '=', this.userData.id)
      .returningAll()
      .executeTakeFirst()

    if (!updatedUser)
      return err(handleError('User not found'))

    this.userData = updatedUser

    return ok(updatedUser)
  }

  // Method to save (insert or update) the user instance
  async save(): Promise<void> {
    if (this.userData.id === undefined) {
      // Insert new user
      const newUser = await db.insertInto('users')
        .values(this.userData)
        .returningAll()
        .executeTakeFirstOrThrow()
      this.userData = newUser
    }
    else {
      // Update existing user
      await this.update(this.userData as UserUpdate)
    }
  }

  // Method to delete the user instance
  async delete(): Promise<void> {
    if (this.userData.id === undefined)
      throw new Error('User ID is undefined')

    await db.deleteFrom('users')
      .where('id', '=', this.userData.id)
      .execute()
    this.userData = {}
  }

  // Method to refresh the user instance data from the database
  async refresh(): Promise<void> {
    if (this.userData.id === undefined)
      throw new Error('User ID is undefined')

    const refreshedUser = await db.selectFrom('users')
      .where('id', '=', this.userData.id)
      .selectAll()
      .executeTakeFirst()

    if (!refreshedUser)
      throw new Error('User not found')

    this.userData = refreshedUser
  }

  toJSON() {
    const output: Partial<UserType> = { ...this.userData }
    this.hidden.forEach((attr) => {
      if (attr in output)
        delete output[attr as keyof Partial<UserType>]
    })
    return output
  }
}

const Model = UserModel

// starting here, ORM functions
export async function find(id: number): Promise<UserModel | null> {
  const userData = await db.selectFrom('users')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()

  if (!userData)
    return null

  return new UserModel(userData)
}

export async function get(criteria: Partial<UserType>) {
  let query = db.selectFrom('users')

  if (criteria.id)
    query = query.where('id', '=', criteria.id) // Kysely is immutable, we must re-assign

  if (criteria.email)
    query = query.where('email', '=', criteria.email)

  if (criteria.name !== undefined) {
    query = query.where(
      'name',
      criteria.name === null ? 'is' : '=',
      criteria.name,
    )
  }

  if (criteria.password)
    query = query.where('password', '=', criteria.password)

  if (criteria.created_at)
    query = query.where('created_at', '=', criteria.created_at)

  if (criteria.updated_at)
    query = query.where('updated_at', '=', criteria.updated_at)

  if (criteria.deleted_at)
    query = query.where('deleted_at', '=', criteria.deleted_at)

  return await query.selectAll().execute()
}

export async function all() {
  return await db.selectFrom('users')
    .selectAll()
    .execute()
}

export async function create(newUser: NewUser) {
  return await db.insertInto('users')
    .values(newUser)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function getOne(criteria: Partial<UserType>) {
  return await db.selectFrom('users')
    .where('id', '=', criteria.id)
    .selectAll()
    .executeTakeFirst()
}

export async function first() {
  return await db.selectFrom('users')
    .selectAll()
    .executeTakeFirst()
}

export async function last() {
  return await db.selectFrom('users')
    .selectAll()
    .orderBy('id', 'desc')
    .executeTakeFirst()
}

export async function update(id: number, userUpdate: UserUpdate) {
  return await db.updateTable('users')
    .set(userUpdate)
    .where('id', '=', id)
    .execute()
}

export async function remove(id: number) {
  return await db.deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findByEmail(email: string) {
  return await db.selectFrom('users')
    .where('email', '=', email)
    .selectAll()
    .executeTakeFirst()
}

export async function where(criteria: Partial<UserType>) {
  let query = db.selectFrom('users')

  if (criteria.id)
    query = query.where('id', '=', criteria.id) // Kysely is immutable, we must re-assign

  if (criteria.email)
    query = query.where('email', '=', criteria.email)

  if (criteria.name !== undefined) {
    query = query.where(
      'name',
      criteria.name === null ? 'is' : '=',
      criteria.name,
    )
  }

  if (criteria.password)
    query = query.where('password', '=', criteria.password)

  if (criteria.created_at)
    query = query.where('created_at', '=', criteria.created_at)

  if (criteria.updated_at)
    query = query.where('updated_at', '=', criteria.updated_at)

  if (criteria.deleted_at)
    query = query.where('deleted_at', '=', criteria.deleted_at)

  return await query.selectAll().execute()
}

export const User = {
  find,
  get,
  all,
  create,
  update,
  remove,
  findByEmail,
  Model,
  first,
  last,
  where,
}

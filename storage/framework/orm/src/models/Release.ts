import type { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { cache } from '@stacksjs/cache'
import { db, sql } from '@stacksjs/database'
import { HttpError } from '@stacksjs/error-handling'

export interface ReleasesTable {
  id?: Generated<number>
  version?: string

  created_at?: Date

  updated_at?: Date

  deleted_at?: Date

}

interface ReleaseResponse {
  data: Releases
  paging: {
    total_records: number
    page: number
    total_pages: number
  }
  next_cursor: number | null
}

export type Release = ReleasesTable
export type ReleaseType = Selectable<Release>
export type NewRelease = Insertable<Release>
export type ReleaseUpdate = Updateable<Release>
export type Releases = ReleaseType[]

export type ReleaseColumn = Releases
export type ReleaseColumns = Array<keyof Releases>

    type SortDirection = 'asc' | 'desc'
interface SortOptions { column: ReleaseType, order: SortDirection }
// Define a type for the options parameter
interface QueryOptions {
  sort?: SortOptions
  limit?: number
  offset?: number
  page?: number
}

export class ReleaseModel {
  private hidden = []
  private fillable = ['version', 'uuid']
  private softDeletes = false
  protected query: any
  protected hasSelect: boolean
  public id: number | undefined
  public version: string | undefined

  public created_at: Date | undefined
  public updated_at: Date | undefined

  constructor(release: Partial<ReleaseType> | null) {
    this.id = release?.id
    this.version = release?.version

    this.created_at = release?.created_at

    this.updated_at = release?.updated_at

    this.query = db.selectFrom('releases')
    this.hasSelect = false
  }

  // Method to find a Release by ID
  async find(id: number): Promise<ReleaseModel | undefined> {
    const query = db.selectFrom('releases').where('id', '=', id).selectAll()

    const model = await query.executeTakeFirst()

    if (!model)
      return undefined

    cache.getOrSet(`release:${id}`, JSON.stringify(model))

    return this.parseResult(new ReleaseModel(model))
  }

  // Method to find a Release by ID
  static async find(id: number): Promise<ReleaseModel | undefined> {
    const query = db.selectFrom('releases').where('id', '=', id).selectAll()

    const instance = new ReleaseModel(null)

    const model = await query.executeTakeFirst()

    if (!model)
      return undefined

    cache.getOrSet(`release:${id}`, JSON.stringify(model))

    return instance.parseResult(new ReleaseModel(model))
  }

  static async all(): Promise<ReleaseModel[]> {
    let query = db.selectFrom('releases').selectAll()

    const instance = new ReleaseModel(null)

    if (instance.softDeletes) {
      query = query.where('deleted_at', 'is', null)
    }

    const results = await query.execute()

    return results.map(modelItem => instance.parseResult(new ReleaseModel(modelItem)))
  }

  static async findOrFail(id: number): Promise<ReleaseModel> {
    let query = db.selectFrom('releases').where('id', '=', id)

    const instance = new ReleaseModel(null)

    if (instance.softDeletes) {
      query = query.where('deleted_at', 'is', null)
    }

    query = query.selectAll()

    const model = await query.executeTakeFirst()

    if (model === undefined)
      throw new HttpError(404, `No ReleaseModel results for ${id}`)

    cache.getOrSet(`release:${id}`, JSON.stringify(model))

    return instance.parseResult(new ReleaseModel(model))
  }

  static async findMany(ids: number[]): Promise<ReleaseModel[]> {
    let query = db.selectFrom('releases').where('id', 'in', ids)

    const instance = new ReleaseModel(null)

    if (instance.softDeletes) {
      query = query.where('deleted_at', 'is', null)
    }

    query = query.selectAll()

    const model = await query.execute()

    return model.map(modelItem => instance.parseResult(new ReleaseModel(modelItem)))
  }

  // Method to get a User by criteria
  static async get(): Promise<ReleaseModel[]> {
    const instance = new ReleaseModel(null)

    if (instance.hasSelect) {
      if (instance.softDeletes) {
        instance.query = instance.query.where('deleted_at', 'is', null)
      }

      const model = await instance.query.execute()

      return model.map((modelItem: ReleaseModel) => new ReleaseModel(modelItem))
    }

    if (instance.softDeletes) {
      instance.query = instance.query.where('deleted_at', 'is', null)
    }

    const model = await instance.query.selectAll().execute()

    return model.map((modelItem: ReleaseModel) => new ReleaseModel(modelItem))
  }

  // Method to get a Release by criteria
  async get(): Promise<ReleaseModel[]> {
    if (this.hasSelect) {
      if (this.softDeletes) {
        this.query = this.query.where('deleted_at', 'is', null)
      }

      const model = await this.query.execute()

      return model.map((modelItem: ReleaseModel) => new ReleaseModel(modelItem))
    }

    if (this.softDeletes) {
      this.query = this.query.where('deleted_at', 'is', null)
    }

    const model = await this.query.selectAll().execute()

    return model.map((modelItem: ReleaseModel) => new ReleaseModel(modelItem))
  }

  static async count(): Promise<number> {
    const instance = new ReleaseModel(null)

    if (instance.softDeletes) {
      instance.query = instance.query.where('deleted_at', 'is', null)
    }

    const results = await instance.query.selectAll().execute()

    return results.length
  }

  async count(): Promise<number> {
    if (this.hasSelect) {
      if (this.softDeletes) {
        this.query = this.query.where('deleted_at', 'is', null)
      }

      const results = await this.query.execute()

      return results.length
    }

    const results = await this.query.selectAll().execute()

    return results.length
  }

  // Method to get all releases
  static async paginate(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<ReleaseResponse> {
    const totalRecordsResult = await db.selectFrom('releases')
      .select(db.fn.count('id').as('total')) // Use 'id' or another actual column name
      .executeTakeFirst()

    const totalRecords = Number(totalRecordsResult?.total) || 0
    const totalPages = Math.ceil(totalRecords / (options.limit ?? 10))

    const releasesWithExtra = await db.selectFrom('releases')
      .selectAll()
      .orderBy('id', 'asc') // Assuming 'id' is used for cursor-based pagination
      .limit((options.limit ?? 10) + 1) // Fetch one extra record
      .offset(((options.page ?? 1) - 1) * (options.limit ?? 10)) // Ensure options.page is not undefined
      .execute()

    let nextCursor = null
    if (releasesWithExtra.length > (options.limit ?? 10))
      nextCursor = releasesWithExtra.pop()?.id ?? null

    return {
      data: releasesWithExtra,
      paging: {
        total_records: totalRecords,
        page: options.page || 1,
        total_pages: totalPages,
      },
      next_cursor: nextCursor,
    }
  }

  // Method to create a new release
  static async create(newRelease: NewRelease): Promise<ReleaseModel> {
    const instance = new ReleaseModel(null)

    const filteredValues = Object.fromEntries(
      Object.entries(newRelease).filter(([key]) => instance.fillable.includes(key)),
    ) as NewRelease

    const result = await db.insertInto('releases')
      .values(filteredValues)
      .executeTakeFirst()

    const model = await find(Number(result.insertId)) as ReleaseModel

    return model
  }

  static async createMany(newReleases: NewRelease[]): Promise<void> {
    const instance = new ReleaseModel(null)

    const filteredValues = newReleases.map(newUser =>
      Object.fromEntries(
        Object.entries(newUser).filter(([key]) => instance.fillable.includes(key)),
      ) as NewRelease,
    )

    await db.insertInto('releases')
      .values(filteredValues)
      .executeTakeFirst()
  }

  static async forceCreate(newRelease: NewRelease): Promise<ReleaseModel> {
    const result = await db.insertInto('releases')
      .values(newRelease)
      .executeTakeFirst()

    const model = await find(Number(result.insertId)) as ReleaseModel

    return model
  }

  // Method to remove a Release
  static async remove(id: number): Promise<void> {
    const instance = new ReleaseModel(null)

    if (instance.softDeletes) {
      await db.updateTable('releases')
        .set({
          deleted_at: sql.raw('CURRENT_TIMESTAMP'),
        })
        .where('id', '=', id)
        .execute()
    }
    else {
      await db.deleteFrom('releases')
        .where('id', '=', id)
        .execute()
    }
  }

  where(...args: (string | number | boolean | undefined | null)[]): ReleaseModel {
    let column: any
    let operator: any
    let value: any

    if (args.length === 2) {
      [column, value] = args
      operator = '='
    }
    else if (args.length === 3) {
      [column, operator, value] = args
    }
    else {
      throw new HttpError(500, 'Invalid number of arguments')
    }

    this.query = this.query.where(column, operator, value)

    return this
  }

  static where(...args: (string | number | boolean | undefined | null)[]): ReleaseModel {
    let column: any
    let operator: any
    let value: any

    const instance = new ReleaseModel(null)

    if (args.length === 2) {
      [column, value] = args
      operator = '='
    }
    else if (args.length === 3) {
      [column, operator, value] = args
    }
    else {
      throw new HttpError(500, 'Invalid number of arguments')
    }

    instance.query = instance.query.where(column, operator, value)

    return instance
  }

  static whereNull(column: string): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.where(column, 'is', null)

    return instance
  }

  whereNull(column: string): ReleaseModel {
    this.query = this.query.where(column, 'is', null)

    return this
  }

  static whereVersion(value: string): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.where('version', '=', value)

    return instance
  }

  static whereIn(column: keyof ReleaseType, values: any[]): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.where(column, 'in', values)

    return instance
  }

  async first(): Promise<ReleaseModel | undefined> {
    const model = await this.query.selectAll().executeTakeFirst()

    if (!model) {
      return undefined
    }

    return this.parseResult(new ReleaseModel(model))
  }

  async firstOrFail(): Promise<ReleaseModel | undefined> {
    const model = await this.query.selectAll().executeTakeFirst()

    if (model === undefined)
      throw new HttpError(404, 'No ReleaseModel results found for query')

    return this.parseResult(new ReleaseModel(model))
  }

  async exists(): Promise<boolean> {
    const model = await this.query.selectAll().executeTakeFirst()

    return model !== null || model !== undefined
  }

  static async first(): Promise<ReleaseType | undefined> {
    return await db.selectFrom('releases')
      .selectAll()
      .executeTakeFirst()
  }

  async last(): Promise<ReleaseType | undefined> {
    return await db.selectFrom('releases')
      .selectAll()
      .orderBy('id', 'desc')
      .executeTakeFirst()
  }

  static async last(): Promise<ReleaseType | undefined> {
    return await db.selectFrom('releases').selectAll().orderBy('id', 'desc').executeTakeFirst()
  }

  static orderBy(column: keyof ReleaseType, order: 'asc' | 'desc'): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.orderBy(column, order)

    return instance
  }

  orderBy(column: keyof ReleaseType, order: 'asc' | 'desc'): ReleaseModel {
    this.query = this.query.orderBy(column, order)

    return this
  }

  static orderByDesc(column: keyof ReleaseType): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.orderBy(column, 'desc')

    return instance
  }

  orderByDesc(column: keyof ReleaseType): ReleaseModel {
    this.query = this.orderBy(column, 'desc')

    return this
  }

  static orderByAsc(column: keyof ReleaseType): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.orderBy(column, 'asc')

    return instance
  }

  orderByAsc(column: keyof ReleaseType): ReleaseModel {
    this.query = this.query.orderBy(column, 'desc')

    return this
  }

  async update(release: ReleaseUpdate): Promise<ReleaseModel | undefined> {
    if (this.id === undefined)
      throw new HttpError(500, 'Release ID is undefined')

    const filteredValues = Object.fromEntries(
      Object.entries(release).filter(([key]) => this.fillable.includes(key)),
    ) as NewRelease

    await db.updateTable('releases')
      .set(filteredValues)
      .where('id', '=', this.id)
      .executeTakeFirst()

    const model = await this.find(Number(this.id))

    return model
  }

  async forceUpdate(release: ReleaseUpdate): Promise<ReleaseModel | undefined> {
    if (this.id === undefined)
      throw new HttpError(500, 'Release ID is undefined')

    await db.updateTable('releases')
      .set(release)
      .where('id', '=', this.id)
      .executeTakeFirst()

    const model = await this.find(Number(this.id))

    return model
  }

  async save(): Promise<void> {
    if (!this)
      throw new HttpError(500, 'Release data is undefined')

    if (this.id === undefined) {
      await db.insertInto('releases')
        .values(this as NewRelease)
        .executeTakeFirstOrThrow()
    }
    else {
      await this.update(this)
    }
  }

  // Method to delete (soft delete) the release instance
  async delete(): Promise<void> {
    if (this.id === undefined)
      throw new HttpError(500, 'Release ID is undefined')

    // Check if soft deletes are enabled
    if (this.softDeletes) {
      // Update the deleted_at column with the current timestamp
      await db.updateTable('releases')
        .set({
          deleted_at: sql.raw('CURRENT_TIMESTAMP'),
        })
        .where('id', '=', this.id)
        .execute()
    }
    else {
      // Perform a hard delete
      await db.deleteFrom('releases')
        .where('id', '=', this.id)
        .execute()
    }
  }

  distinct(column: keyof ReleaseType): ReleaseModel {
    this.query = this.query.select(column).distinct()

    this.hasSelect = true

    return this
  }

  static distinct(column: keyof ReleaseType): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.select(column).distinct()

    instance.hasSelect = true

    return instance
  }

  join(table: string, firstCol: string, secondCol: string): ReleaseModel {
    this.query = this.query.innerJoin(table, firstCol, secondCol)

    return this
  }

  static join(table: string, firstCol: string, secondCol: string): ReleaseModel {
    const instance = new ReleaseModel(null)

    instance.query = instance.query.innerJoin(table, firstCol, secondCol)

    return instance
  }

  static async rawQuery(rawQuery: string): Promise<any> {
    return await sql`${rawQuery}`.execute(db)
  }

  toJSON() {
    const output: Partial<ReleaseType> = {

      id: this.id,
      version: this.version,

      created_at: this.created_at,

      updated_at: this.updated_at,

    }

        type Release = Omit<ReleaseType, 'password'>

        return output as Release
  }

  parseResult(model: ReleaseModel): ReleaseModel {
    for (const hiddenAttribute of this.hidden) {
      delete model[hiddenAttribute as keyof ReleaseModel]
    }

    return model
  }
}

async function find(id: number): Promise<ReleaseModel | undefined> {
  const query = db.selectFrom('releases').where('id', '=', id).selectAll()

  const model = await query.executeTakeFirst()

  if (!model)
    return undefined

  return new ReleaseModel(model)
}

export async function count(): Promise<number> {
  const results = await ReleaseModel.count()

  return results
}

export async function create(newRelease: NewRelease): Promise<ReleaseModel> {
  const result = await db.insertInto('releases')
    .values(newRelease)
    .executeTakeFirstOrThrow()

  return await find(Number(result.insertId)) as ReleaseModel
}

export async function rawQuery(rawQuery: string): Promise<any> {
  return await sql`${rawQuery}`.execute(db)
}

export async function remove(id: number): Promise<void> {
  await db.deleteFrom('releases')
    .where('id', '=', id)
    .execute()
}

export async function whereVersion(value: string): Promise<ReleaseModel[]> {
  const query = db.selectFrom('releases').where('version', '=', value)
  const results = await query.execute()

  return results.map(modelItem => new ReleaseModel(modelItem))
}

export const Release = ReleaseModel

export default Release

import { path } from '@stacksjs/path'
import { fs, glob } from '@stacksjs/storage'
import type {  ModelOptions } from '@stacksjs/types'

export interface FieldArrayElement {
  entity: string
  charValue?: string | null
  // Add other properties as needed
}

export interface ModelElement {
  field: string
  default: string | number | boolean | Date | undefined | null
  unique: boolean
  fieldArray: FieldArrayElement | null
}

interface ModelDefault {
  default: ModelOptions
}

await initiateModelGeneration()
await setKyselyTypes()

async function initiateModelGeneration(): Promise<void> {
  await deleteExistingModels()
  const modelFiles = glob.sync(path.userModelsPath('*.ts'))

  for (const modelFile of modelFiles) {
    const model = await import(modelFile)

    const tableName = model.default.table
    const modelName = model.default.name

    const file = Bun.file(
      path.projectStoragePath(`framework/orm/${modelName}.ts`),
    )

    const fields = await extractFields(model, modelFile)

    const classString = await generateModelString(tableName, model, fields)

    const writer = file.writer()

    writer.write(classString)

    await writer.end()
  }
}

async function getRelations(model: ModelDefault): Promise<any[]> {
  const relationsArray = ['hasOne', 'belongsTo', 'hasMany', 'belongsToMany', 'hasOneThrough']

  const relationships = []

  for (const relation of relationsArray) {
    if (hasRelations(model.default, relation)) {
      for (const relationInstance of model.default[relation]) {

        const modelRelationPath = path.userModelsPath(
          `${relationInstance.model.name}.ts`,
        )

        const modelRelation = await import(modelRelationPath)

        const formattedModelName = model.default.name.toLowerCase()

        relationships.push({
          relationship: relation,
          model: relationInstance.model.name,
          table: modelRelation.default.table,
          foreignKey: relationInstance.foreignKey || `${formattedModelName}_id`,
          relationName: relationInstance.relationName || '',
          throughModel: relationInstance.through || '',
          throughForeignKey: relationInstance.throughForeignKey || '',
          pivotTable:
            relationInstance?.pivotTable ||
            `${formattedModelName}_${modelRelation.default.table}`,
        })
      }
    }
  }

  return relationships
}

function hasRelations(obj: any, key: string): boolean {
  return key in obj
}

async function deleteExistingModels() {
  const modelPaths = glob.sync(path.projectStoragePath(`framework/orm/*.ts`))

  for (const modelPath of modelPaths) {
    if (fs.existsSync(modelPath)) await Bun.$`rm ${modelPath}`
  }

  const typePath = path.projectStoragePath(
    `framework/core/orm/src/generated/types.ts`,
  )

  if (fs.existsSync(typePath)) await Bun.$`rm ${typePath}`
}

async function setKyselyTypes() {
  let text = ``
  const modelFiles = glob.sync(path.userModelsPath('*.ts'))

  for (const modelFile of modelFiles) {
    const model = await import(modelFile)

    const tableName = model.default.table
    const formattedTableName =
      tableName.charAt(0).toUpperCase() + tableName.slice(1)
    const modelName = model.default.name

    text += `import type { ${formattedTableName}Table } from '../../../../orm/${modelName}'\n`
  }

  text += `import type { Generated } from 'kysely'\n\n`

  let pivotFormatted = ''
  for (const modelFile of modelFiles) {
    const model = await import(modelFile)

    const pivotTables = await getPivotTables(model)

    for (const pivotTable of pivotTables) {
      const words = pivotTable.table.split('_')

      pivotFormatted = `${words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')}Table`

      text += `export interface ${pivotFormatted} {
        id: Generated<number>
        ${pivotTable.firstForeignKey}: number
        ${pivotTable.secondForeignKey}: number
      }`
    }
  }

  text += `\nexport interface Database {\n`

  for (const modelFile of modelFiles) {
    const model = await import(modelFile)

    const tableName = model.default.table
    const formattedTableName =
      tableName.charAt(0).toUpperCase() + tableName.slice(1)

    const pivotTables = await getPivotTables(model)

    for (const pivotTable of pivotTables)
      text += `  ${pivotTable.table}: ${pivotFormatted}\n`

    text += `  ${tableName}: ${formattedTableName}Table\n`
  }

  text += `}`

  const file = Bun.file(
    path.projectStoragePath(`framework/core/orm/src/generated/types.ts`),
  )

  const writer = file.writer()

  writer.write(text)

  await writer.end()
}

async function extractFields(
  model: ModelDefault,
  modelFile: string,
): Promise<ModelElement[]> {
  // TODO: we can improve this type
  const fields: Record<string, any> = model.default.attributes
  const fieldKeys = Object.keys(fields)

  const rules: string[] = []

  const file = Bun.file(modelFile) // Assuming Bun is imported properly

  const code = await file.text()

  const regex = /rule:.*$/gm

  let match: RegExpExecArray | null
  match = regex.exec(code)

  while (match !== null) {
    rules.push(match[0])
    match = regex.exec(code)
  }

  const input: ModelElement[] = fieldKeys.map((field, index) => {
    const fieldExist = fields[field]
    let defaultValue = null
    let uniqueValue = false

    if (fieldExist) {
      defaultValue = fieldExist.default || null
      uniqueValue = fieldExist.unique || false
    }

    return {
      field,
      default: defaultValue,
      unique: uniqueValue,
      fieldArray: parseRule(rules[index] ?? ''),
    }
  })

  return input
}

function parseRule(rule: string): FieldArrayElement | null {
  const parts = rule.split('rule: schema.')

  if (parts.length !== 2) return null

  if (!parts[1]) parts[1] = ''

  const extractedString = parts[1].replace(/,/g, '')

  if (!extractedString) return null

  const extractedParts = extractedString.split('.')
  const regex = /\(([^)]+)\)/

  return (
    extractedParts.map((input) => {
      const match = regex.exec(input)
      const value = match ? match[1] : null
      const field = input.replace(regex, '').replace(/\(|\)/g, '')
      return { entity: field, charValue: value }
    })[0] || null
  )
}

function getRelationType(relation: string): string {
  const belongToType = /belongs/
  const hasType = /has/
  const throughType = /Through/

  if (throughType.test(relation)) return 'throughType'

  if (belongToType.test(relation)) return 'belongsType'

  if (hasType.test(relation)) return 'hasType'

  return ''
}

function getRelationCount(relation: string): string {
  const singular = /One/
  const plural = /Many/

  if (plural.test(relation)) return 'many'

  if (singular.test(relation)) return 'one'

  return ''
}

async function getPivotTables(
  model: ModelDefault,
): Promise<
  { table: string; firstForeignKey?: string; secondForeignKey?: string }[]
> {
  const pivotTable = []

  if ('belongsToMany' in model.default) {
    for (const belongsToManyRelation of  model.default.belongsToMany) {
      const modelRelationPath = path.userModelsPath(
        `${belongsToManyRelation.model.name}.ts`,
      )
      const modelRelation = await import(modelRelationPath)

      const formattedModelName = model.default.name.toLowerCase()

      pivotTable.push({
        table:
        belongsToManyRelation?.pivotTable ||
          `${formattedModelName}_${modelRelation.default.table}`,
        firstForeignKey: belongsToManyRelation.firstForeignKey,
        secondForeignKey: belongsToManyRelation.secondForeignKey,
      })
    }

    return pivotTable
  }

  return []
}

async function generateModelString(
  tableName: string,
  model: ModelDefault,
  attributes: ModelElement[],
): Promise<string> {
  const modelName = model.default.name

  // users -> Users
  const formattedTableName =
    tableName.charAt(0).toUpperCase() + tableName.slice(1)

  // User -> user
  const formattedModelName = modelName.toLowerCase()

  let fieldString = ''

  let relationMethods = ``
  let relationImports = ``

  const relations = await getRelations(model)

  for (const relationInstance of relations) {
    relationImports += `import ${relationInstance.model} from './${relationInstance.model}'\n\n`
  }
    

  for (const relation of relations) {
    const modelRelation = relation.model
    const foreignKeyRelation = relation.foreignKey
    const tableRelation = relation.table
    const pivotTableRelation = relation.pivotTable
    const formattedModelRelation = modelRelation.toLowerCase()
    const capitalizeTableRelation =
      tableRelation.charAt(0).toUpperCase() + tableRelation.slice(1)

    const relationType = getRelationType(relation.relationship)
    const relationCount = getRelationCount(relation.relationship)

    if (relationType === 'throughType') {
      const relationName = relation.relationName || formattedModelName + modelRelation
      const throughRelation = relation.throughModel
      const formattedThroughRelation = relation.throughModel.name.toLowerCase()
      const throughTableRelation = throughRelation.table
      const foreignKeyThroughRelation = relation.throughForeignKey || formattedThroughRelation + '_id'
      
      relationMethods += `
      async ${relationName}() {
        if (this.${formattedModelName}.id === undefined)
          throw new Error('Relation Error!')

        const firstModel = await db.selectFrom('${throughTableRelation}')
        .where('${foreignKeyRelation}', '=', this.${formattedModelName}.id)
        .selectAll()
        .executeTakeFirst()

        if (! firstModel) 
          throw new Error('Model Relation Not Found!')

        const finalModel = await db.selectFrom('${tableRelation}')
        .where('${foreignKeyThroughRelation}', '=', firstModel.id)
        .selectAll()
        .executeTakeFirst()

        return new ${modelRelation}.modelInstance(finalModel)
      }\n\n`
    }

    if (relationType === 'hasType' && relationCount === 'many') {
      const relationName = relation.relationName || tableRelation

      relationMethods += `
      async ${relationName}() {
        if (this.${formattedModelName}.id === undefined)
          throw new Error('Relation Error!')

        const results = await db.selectFrom('${tableRelation}')
          .where('${foreignKeyRelation}', '=', this.${formattedModelName}.id)
          .selectAll()
          .execute()

          return results
      }\n\n`
    }

    if (relationType === 'hasType' && relationCount === 'one') {
      const relationName = relation.relationName || formattedModelRelation
      relationMethods += `
      async ${relationName}() {
        if (this.${formattedModelName}.id === undefined)
          throw new Error('Relation Error!')

        const model = await db.selectFrom('${tableRelation}')
        .where('${foreignKeyRelation}', '=', this.${formattedModelName}.id)
        .selectAll()
        .executeTakeFirst()

        if (! model) 
          throw new Error('Model Relation Not Found!')

        return new ${modelRelation}.modelInstance(model)
      }\n\n`
    }

    if (relationType === 'belongsType' && !relationCount) {
      const relationName = relation.relationName || formattedModelRelation

      relationMethods += `
      async ${relationName}() {
        if (this.${foreignKeyRelation} === undefined)
          throw new Error('Relation Error!')

        const model = await db.selectFrom('${tableRelation}')
        .where('id', '=', ${foreignKeyRelation})
        .selectAll()
        .executeTakeFirst()

        if (! model) 
          throw new Error('Model Relation Not Found!')

        return new ${modelRelation}.modelInstance(model)
      }\n\n`
    }

    if (relationType === 'belongsType' && relationCount === 'many') {
      const pivotTable = pivotTableRelation || tableRelation
      const relationName = relation.relationName || formattedModelName + capitalizeTableRelation
      
      relationMethods += `
      async ${relationName}() {
        if (this.${formattedModelName}.id === undefined)
          throw new Error('Relation Error!')
        
        const results = await db.selectFrom('${pivotTable}')
          .where('${foreignKeyRelation}', '=', this.${formattedModelName}.id)
          .selectAll()
          .execute()

          return results
      }\n\n`
    }
  }

  for (const attribute of attributes)
    fieldString += ` ${attribute.field}: ${attribute.fieldArray?.entity}\n     `

  return `import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
    import type { Result } from '@stacksjs/error-handling'
    import { err, handleError, ok } from '@stacksjs/error-handling'
    import { db } from '@stacksjs/database'
    ${relationImports}
    // import { Kysely, MysqlDialect, PostgresDialect } from 'kysely'
    // import { Pool } from 'pg'
    
    // TODO: we need an action that auto-generates these table interfaces
    export interface ${formattedTableName}Table {
      id: Generated<number>
     ${fieldString}
      created_at: ColumnType<Date, string | undefined, never>
      updated_at: ColumnType<Date, string | undefined, never>
      deleted_at: ColumnType<Date, string | undefined, never>
    }
    
    interface ${modelName}Response {
      data: ${formattedTableName}
      paging: {
        total_records: number
        page: number
        total_pages: number
      }
      next_cursor: number | null
    }
    
    export type ${modelName}Type = Selectable<${formattedTableName}Table>
    export type New${modelName} = Insertable<${formattedTableName}Table>
    export type ${modelName}Update = Updateable<${formattedTableName}Table>
    export type ${formattedTableName} = ${modelName}Type[]
    
    export type ${modelName}Column = ${formattedTableName}
    export type ${modelName}Columns = Array<keyof ${formattedTableName}>
    
    type SortDirection = 'asc' | 'desc'
    interface SortOptions { column: ${modelName}Type, order: SortDirection }
    // Define a type for the options parameter
    interface QueryOptions {
      sort?: SortOptions
      limit?: number
      offset?: number
      page?: number
    }
    
    export class ${modelName}Model {
      private ${formattedModelName}: Partial<${modelName}Type>
      private hidden = ['password'] // TODO: this hidden functionality needs to be implemented still
    
      constructor(${formattedModelName}: Partial<${modelName}Type>) {
        this.${formattedModelName} = ${formattedModelName}
      }
    
      // Method to find a ${formattedModelName} by ID
      static async find(id: number, fields?: (keyof ${modelName}Type)[]) {
        let query = db.selectFrom('${tableName}').where('id', '=', id)
    
        if (fields)
          query = query.select(fields)
        else
          query = query.selectAll()
    
        const model = await query.executeTakeFirst()
    
        if (!model)
          return null
    
        return new ${modelName}Model(model)
      }
    
      static async findMany(ids: number[], fields?: (keyof ${modelName}Type)[]) {
        let query = db.selectFrom('${tableName}').where('id', 'in', ids)
    
        if (fields)
          query = query.select(fields)
        else
          query = query.selectAll()
    
        const model = await query.execute()
    
        return model.map(modelItem => new ${modelName}Model(modelItem))
      }
    
      // Method to get a ${formattedModelName} by criteria
      static async get(criteria: Partial<${modelName}Type>, options: QueryOptions = {}): Promise<${modelName}Model[]> {
        let query = db.selectFrom('${tableName}')
    
        // Apply sorting from options
        if (options.sort)
          query = query.orderBy(options.sort.column, options.sort.order)
    
        // Apply limit and offset from options
        if (options.limit !== undefined)
          query = query.limit(options.limit)
    
        if (options.offset !== undefined)
          query = query.offset(options.offset)
    
        const model = await query.selectAll().execute()
        return model.map(modelItem => new ${modelName}Model(modelItem))
      }
    
      // Method to get all ${tableName}
      static async all(options: QueryOptions = { limit: 10, offset: 0, page: 1 }): Promise<${modelName}Response> {
        const totalRecordsResult = await db.selectFrom('${tableName}')
          .select(db.fn.count('id').as('total')) // Use 'id' or another actual column name
          .executeTakeFirst()
    
        const totalRecords = Number(totalRecordsResult?.total) || 0
        const totalPages = Math.ceil(totalRecords / (options.limit ?? 10))
    
        const ${tableName}WithExtra = await db.selectFrom('${tableName}')
          .selectAll()
          .orderBy('id', 'asc') // Assuming 'id' is used for cursor-based pagination
          .limit((options.limit ?? 10) + 1) // Fetch one extra record
          .offset((options.page! - 1) * (options.limit ?? 10))
          .execute()
    
        let nextCursor = null
        if (${tableName}WithExtra.length > (options.limit ?? 10))
          nextCursor = ${tableName}WithExtra.pop()!.id // Use the ID of the extra record as the next cursor
    
        return {
          data: ${tableName}WithExtra,
          paging: {
            total_records: totalRecords,
            page: options.page!,
            total_pages: totalPages,
          },
          next_cursor: nextCursor,
        }
      }
    
      // Method to create a new ${formattedModelName}
      static async create(new${modelName}: New${modelName}): Promise<${modelName}Model> {
        const model = await db.insertInto('${tableName}')
          .values(new${modelName})
          .returningAll()
          .executeTakeFirstOrThrow()
    
        return new ${modelName}Model(model)
      }
    
      // Method to update a ${formattedModelName}
      static async update(id: number, ${formattedModelName}Update: ${modelName}Update): Promise<${modelName}Model> {
        const model = await db.updateTable('${tableName}')
          .set(${formattedModelName}Update)
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirstOrThrow()
    
        return new ${modelName}Model(model)
      }
    
      // Method to remove a ${formattedModelName}
      static async remove(id: number): Promise<${modelName}Model> {
        const model = await db.deleteFrom('${tableName}')
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirstOrThrow()
    
        return new ${modelName}Model(model)
      }
      
      async where(column: string, operator = '=', value: any) {
        let query = db.selectFrom('${tableName}')

        query = query.where(column, operator, value)
    
        return await query.selectAll().execute()
      }

      async whereIs(criteria: Partial<${modelName}Type>, options: QueryOptions = {}) {
        let query = db.selectFrom('${tableName}')
    
        // Existing criteria checks
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
    
        // Apply sorting from options
        if (options.sort)
          query = query.orderBy(options.sort.column, options.sort.order)
    
        // Apply pagination from options
        if (options.limit !== undefined)
          query = query.limit(options.limit)
    
        if (options.offset !== undefined)
          query = query.offset(options.offset)
    
        return await query.selectAll().execute()
      }
    
      async whereIn(column: keyof ${modelName}Type, values: any[], options: QueryOptions = {}) {
        let query = db.selectFrom('${tableName}')
    
        query = query.where(column, 'in', values)
    
        // Apply sorting from options
        if (options.sort)
          query = query.orderBy(options.sort.column, options.sort.order)
    
        // Apply pagination from options
        if (options.limit !== undefined)
          query = query.limit(options.limit)
    
        if (options.offset !== undefined)
          query = query.offset(options.offset)
    
        return await query.selectAll().execute()
      }
    
      async first() {
        return await db.selectFrom('${tableName}')
          .selectAll()
          .executeTakeFirst()
      }
    
      async last() {
        return await db.selectFrom('${tableName}')
          .selectAll()
          .orderBy('id', 'desc')
          .executeTakeFirst()
      }
    
      async orderBy(column: keyof ${modelName}Type, order: 'asc' | 'desc') {
        return await db.selectFrom('${tableName}')
          .selectAll()
          .orderBy(column, order)
          .execute()
      }
    
      async orderByDesc(column: keyof ${modelName}Type) {
        return await db.selectFrom('${tableName}')
          .selectAll()
          .orderBy(column, 'desc')
          .execute()
      }
    
      async orderByAsc(column: keyof ${modelName}Type) {
        return await db.selectFrom('${tableName}')
          .selectAll()
          .orderBy(column, 'asc')
          .execute()
      }
    
      // Method to get the ${formattedModelName} instance itself
      self() {
        return this
      }
    
      // Method to get the ${formattedModelName} instance data
      get() {
        return this.${formattedModelName}
      }
    
      // Method to update the ${formattedModelName} instance
      async update(${formattedModelName}: ${modelName}Update): Promise<Result<${modelName}Type, Error>> {
        if (this.${formattedModelName}.id === undefined)
          return err(handleError('${modelName} ID is undefined'))
    
        const updatedModel = await db.updateTable('${tableName}')
          .set(${formattedModelName})
          .where('id', '=', this.${formattedModelName}.id)
          .returningAll()
          .executeTakeFirst()
    
        if (!updatedModel)
          return err(handleError('${modelName} not found'))
    
        this.${formattedModelName} = updatedModel
    
        return ok(updatedModel)
      }
    
      // Method to save (insert or update) the ${formattedModelName} instance
      async save(): Promise<void> {
        if (!this.${formattedModelName})
          throw new Error('${modelName} data is undefined')
    
        if (this.${formattedModelName}.id === undefined) {
          // Insert new ${formattedModelName}
          const newModel = await db.insertInto('${tableName}')
            .values(this.${formattedModelName} as New${modelName})
            .returningAll()
            .executeTakeFirstOrThrow()
          this.${formattedModelName} = newModel
        }
        else {
          // Update existing ${formattedModelName}
          await this.update(this.${formattedModelName})
        }
      }
    
      // Method to delete the ${formattedModelName} instance
      async delete(): Promise<void> {
        if (this.${formattedModelName}.id === undefined)
          throw new Error('${modelName} ID is undefined')
    
        await db.deleteFrom('${tableName}')
          .where('id', '=', this.${formattedModelName}.id)
          .execute()
    
        this.${formattedModelName} = {}
      }
    
      // Method to refresh the ${formattedModelName} instance data from the database
      async refresh(): Promise<void> {
        if (this.${formattedModelName}.id === undefined)
          throw new Error('${modelName} ID is undefined')
    
        const refreshedModel = await db.selectFrom('${tableName}')
          .where('id', '=', this.${formattedModelName}.id)
          .selectAll()
          .executeTakeFirst()
    
        if (!refreshedModel)
          throw new Error('${modelName} not found')
    
        this.${formattedModelName} = refreshedModel
      }

      ${relationMethods}
    
      toJSON() {
        const output: Partial<${modelName}Type> = { ...this.${formattedModelName} }
    
        this.hidden.forEach((attr) => {
          if (attr in output)
            delete output[attr as keyof Partial<${modelName}Type>]
        })
    
        type ${modelName} = Omit<${modelName}Type, 'password'>
    
        return output as ${modelName}
      }
    }
    
    const Model = ${modelName}Model
    
    // starting here, ORM functions
    export async function find(id: number, fields?: (keyof ${modelName}Type)[]) {
      let query = db.selectFrom('${tableName}').where('id', '=', id)
    
      if (fields)
        query = query.select(fields)
      else
        query = query.selectAll()
    
      const model = await query.executeTakeFirst()
    
      if (!model)
        return null
    
      return new ${modelName}Model(model)
    }
    
    export async function findMany(ids: number[], fields?: (keyof ${modelName}Type)[]) {
      let query = db.selectFrom('${tableName}').where('id', 'in', ids)
    
      if (fields)
        query = query.select(fields)
      else
        query = query.selectAll()
    
      const model = await query.execute()
    
      return model.map(modelItem => new ${modelName}Model(modelItem))
    }
    
    export async function get(criteria: Partial<${modelName}Type>, sort: { column: keyof ${modelName}Type, order: 'asc' | 'desc' } = { column: 'created_at', order: 'desc' }) {
      let query = db.selectFrom('${tableName}')
    
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
    
      // Apply sorting based on the 'sort' parameter
      query = query.orderBy(sort.column, sort.order)
    
      return await query.selectAll().execute()
    }
    
    export async function all(limit: number = 10, offset: number = 0) {
      return await db.selectFrom('${tableName}')
        .selectAll()
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
        .execute()
    }
    
    export async function create(new${modelName}: New${modelName}) {
      return await db.insertInto('${tableName}')
        .values(new${modelName})
        .returningAll()
        .executeTakeFirstOrThrow()
    }
    
    export async function first() {
      return await db.selectFrom('${tableName}')
        .selectAll()
        .executeTakeFirst()
    }
    
    export async function last() {
      return await db.selectFrom('${tableName}')
        .selectAll()
        .orderBy('id', 'desc')
        .executeTakeFirst()
    }
    
    export async function update(id: number, ${formattedModelName}Update: ${modelName}Update) {
      return await db.updateTable('${tableName}')
        .set(${formattedModelName}Update)
        .where('id', '=', id)
        .execute()
    }
    
    export async function remove(id: number) {
      return await db.deleteFrom('${tableName}')
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
    }

    export async function where(column: string, operator = '=', value: any) {
      let query = db.selectFrom('${tableName}')

      query = query.where(column, operator, value)
  
      return await query.selectAll().execute()
    }
    
    export async function whereIs(
      criteria: Partial<${modelName}Type>,
      options: QueryOptions = {},
    ) {
      let query = db.selectFrom('${tableName}')
    
      // Apply criteria
      if (criteria.id)
        query = query.where('id', '=', criteria.id)
    
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
    
      // Apply sorting from options
      if (options.sort)
        query = query.orderBy(options.sort.column, options.sort.order)
    
      // Apply pagination from options
      if (options.limit !== undefined)
        query = query.limit(options.limit)
    
      if (options.offset !== undefined)
        query = query.offset(options.offset)
    
      return await query.selectAll().execute()
    }
    
    export async function whereIn(
      column: keyof ${modelName}Type,
      values: any[],
      options: QueryOptions = {},
    ) {
      let query = db.selectFrom('${tableName}')
    
      query = query.where(column, 'in', values)
    
      // Apply sorting from options
      if (options.sort)
        query = query.orderBy(options.sort.column, options.sort.order)
    
      // Apply pagination from options
      if (options.limit !== undefined)
        query = query.limit(options.limit)
    
      if (options.offset !== undefined)
        query = query.offset(options.offset)
    
      return await query.selectAll().execute()
    }
    
    export const ${modelName} = {
      find,
      findMany,
      get,
      all,
      create,
      update,
      remove,
      Model,
      first,
      last,
      where,
      whereIn,
      modelInstance: ${modelName}Model
    }
    
    export default ${modelName}`
}

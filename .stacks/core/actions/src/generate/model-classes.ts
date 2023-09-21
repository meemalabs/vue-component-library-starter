import { path as p } from '@stacksjs/path'

const file = Bun.file(p.projectStoragePath('framework/orm/UserModel.ts'))

const writer = file.writer()

writer.write(`import { dbDialect } from '@stacksjs/database'
import { Kysely } from 'kysely'

class UserModel extends Kysely<any> {
  constructor() {
    super({ dialect: dbDialect })
  }

  public async find(id: number) {
    return await this.selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }

  public all() {
    return this.selectFrom('users')
      .selectAll()
  }
}

export const User = new UserModel()
`)

await writer.end()

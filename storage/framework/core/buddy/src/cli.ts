import process from 'node:process'
import { handleError } from '@stacksjs/error-handling'
import { cli } from '@stacksjs/cli'
import { ensureProjectIsInitialized } from '@stacksjs/utils'
import * as cmd from './commands'

// setup global error handlers
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

async function main() {
  const buddy = cli('buddy')

  // the following commands are not dependent on the project being initialized
  cmd.setup(buddy)
  cmd.key(buddy)

  // before running any commands, ensure the project is already initialized
  await ensureProjectIsInitialized()

  cmd.build(buddy)
  cmd.changelog(buddy)
  cmd.clean(buddy)
  cmd.cloud(buddy)
  // cmd.commit(buddy)
  cmd.configure(buddy)
  cmd.dev(buddy)
  cmd.domains(buddy)
  cmd.deploy(buddy)
  cmd.dns(buddy)
  cmd.fresh(buddy)
  cmd.generate(buddy)
  cmd.http(buddy)
  cmd.install(buddy)
  cmd.lint(buddy)
  // cmd.make(buddy)
  // cmd.migrate(buddy)
  cmd.release(buddy)
  // cmd.seed(buddy)
  cmd.setup(buddy)
  // cmd.example(buddy)
  // cmd.test(buddy)
  // cmd.version(buddy)
  // cmd.prepublish(buddy)
  // cmd.upgrade(buddy)

  buddy.parse()
}

await main()

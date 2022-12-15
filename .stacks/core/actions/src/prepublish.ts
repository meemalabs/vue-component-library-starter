import { log } from '@stacksjs/logging'
import { runtimePath } from '@stacksjs/path'
import { runNpmScript } from '@stacksjs/utils'
import { NpmScript } from '@stacksjs/types'

log.info('Running prepublish command...')

// right before we publish, we need to build Stacks
const result = await runNpmScript(NpmScript.BuildStacks, { debug: true, cwd: runtimePath() })

if (result.isErr()) {
  log.error('There was an error while prepublishing your stack, during the process of building Stacks.', result.error)
  process.exit()
}

log.success('Prepublishing completed')

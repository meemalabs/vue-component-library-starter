import type { CLI, TinkerOptions } from '@stacksjs/types'
import { runAction } from '@stacksjs/actions'
import { intro, outro } from '@stacksjs/cli'
import { Action, ExitCode } from '@stacksjs/types'

async function tinker(buddy: CLI) {
  const descriptions = {
    tinker: 'Tinker with your code',
    verbose: 'Enable verbose output',
  }

  buddy
    .command('tinker', descriptions.tinker)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: TinkerOptions) => {
      const perf = await intro('buddy tinker')
      const result = await runAction(Action.Tinker, options)

      if (result.isErr()) {
        outro('While running the tinker command, there was an issue', { startTime: perf, useSeconds: true, isError: true }, result.error || undefined)
        process.exit()
      }

      outro('Tinker mode exited.', { startTime: perf, useSeconds: true })
      process.exit(ExitCode.Success)
    })
}

export { tinker }

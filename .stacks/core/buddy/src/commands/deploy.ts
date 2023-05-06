import type { CLI, DeployOptions } from '@stacksjs/types'
import { ExitCode } from '@stacksjs/types'

async function deploy(buddy: CLI) {
  const descriptions = {
    deploy: 'Reinstalls your npm dependencies',
    verbose: 'Enable verbose output',
  }

  buddy
    .command('deploy', descriptions.deploy)
    .option('--verbose', descriptions.verbose, { default: false })
    .option('-a, --a', descriptions.verbose)
    .action(async (options: DeployOptions) => {
      // const perf = await intro('buddy deploy')
      // const result = await runAction(Action.Deploy, options)

      // if (result.isErr()) {
      //   outro('While running the `buddy deploy`, there was an issue', { startTime: perf, useSeconds: true, isError: true }, result.error)
      //   process.exit()
      // }

      // outro('Deployment succeeded.', { startTime: perf, useSeconds: true })
      process.exit(ExitCode.Success)
    })
}

export { deploy }

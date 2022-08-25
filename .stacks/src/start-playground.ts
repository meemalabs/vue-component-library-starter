import Prompts from 'prompts'
import { ExitCode } from './cli/exit-code'
import { runNpmScript } from './run-npm-script'
import { NpmScript } from './types/cli'

const { prompts } = Prompts

export async function startPlayground(options: any) {
  if (options.components || options === 'components') {
    // eslint-disable-next-line no-console
    console.log('Starting your components playground...')
    await runNpmScript(NpmScript.Playground)
  }

  else {
    const answer = await prompts.select({
      type: 'select',
      name: 'playground',
      message: 'Which playground are you trying to start?',
      choices: [
        { title: 'Components', value: 'components' },
      ],
      initial: 0,
    })

    // @ts-expect-error the answer object type expects to return a void type but it returns a string
    if (answer === 'components') {
      // eslint-disable-next-line no-console
      console.log('Starting development server for your components...')
      await runNpmScript(NpmScript.DevComponents)
    }

    else { process.exit(ExitCode.InvalidArgument) }
  }
}

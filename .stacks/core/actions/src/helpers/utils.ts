import storage from '@stacksjs/storage'
import { italic, log, runCommand, runCommands } from '@stacksjs/cli'
import { actionsPath, functionsPath } from '@stacksjs/path'
import type { ActionOptions, CommandResult } from '@stacksjs/types'
import { err } from '@stacksjs/error-handling'

function parseOptions(options?: ActionOptions) {
  if (!options)
    return ''

  const parsedOptions = Object.entries(options).map(([key, value]) => {
    if (key.length === 1)
      return
    if (typeof value === 'boolean' && value) // if the value is a boolean and true, just return the key
      return `--${key}`
    else
      return `--${key}=${value}`
  })

  // filter out undefined values and join the array
  return parsedOptions.filter(Boolean).join(' ').replace('----=', '')
}

export type ActionResult = CommandResult

/**
 * Run an Action the Stacks way.
 *
 * @param command The action to invoke.
 * @param options The options to pass to the command.
 * @returns The result of the command.
 */
export async function runAction(action: string, options?: ActionOptions): Promise<CommandResult> {
  if (!hasAction(action))
    return err(`The specified action "${action}" does not exist`)

  // we need to parse options here because they need to bw passed to the action
  const opts = parseOptions(options)
  const cmd = `npx tsx ${actionsPath(`${action}.ts ${opts}`)}`

  if (options?.verbose)
    log.debug('running command:', italic(cmd))

  return options?.showSpinner
    ? await runCommands([cmd], options) as CommandResult
    : await runCommand(cmd, options)
}

/**
 * Run Actions the Stacks way.
 *
 * @param command The action to invoke.
 * @param options The options to pass to the command.
 * @returns The result of the command.
 */
export async function runActions(actions: string[], options?: ActionOptions): Promise<CommandResult | CommandResult[]> {
  if (!actions.length)
    return err('No actions were specified')

  for (const action of actions) {
    if (!hasAction(action))
      return err(`The specified action "${action}" does not exist`)
  }

  const commands = actions.map(action => `npx tsx ${actionsPath(`${action}.ts`)}`)

  return await runCommands(commands, options)
}

export function hasAction(action: string) {
  if (storage.isFile(functionsPath(`actions/${action}.ts`)))
    return true

  if (storage.isFile(actionsPath(`${action}.ts`)))
    return true

  return false
}

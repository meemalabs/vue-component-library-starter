import { log } from '@stacksjs/logging'
import { seed } from '@stacksjs/database'
import { Action, NpmScript } from '@stacksjs/types'
import type { GeneratorOptions } from '@stacksjs/types'
import { runNpmScript } from '@stacksjs/utils'
import { runCommand } from '@stacksjs/cli'
import { frameworkPath } from '@stacksjs/path'
import { runAction } from '../helpers'

export async function invoke(options?: GeneratorOptions) {
  if (options?.types)
    await types(options)

  else if (options?.entries)
    await libEntries(options)

  else if (options?.webTypes)
    await webTypes(options)

  else if (options?.customData)
    await vsCodeCustomData(options)

  else if (options?.ideHelpers)
    await ideHelpers(options)

  else if (options?.vueCompatibility)
    await vueCompat(options)

  else if (options?.componentMeta)
    await componentMeta(options)
}

/**
 * An alias of the invoke method.
 * @param options
 * @returns
 */
export async function generate(options: GeneratorOptions) {
  return invoke(options)
}

export async function libEntries(options: GeneratorOptions) {
  const result = await runCommand('tsx .stacks/core/actions/src/generate-package-json.ts', { ...options, verbose: true, cwd: projectPath() })

  if (result.isErr()) {
    log.error('There was an error generating your library entry points.', result.error)
    process.exit()
  }

  log.success('Library entry points were generated successfully')
}

export async function vueCompat(options?: GeneratorOptions) {
  const result = await runNpmScript(NpmScript.GenerateVueCompat, options)

  if (result.isErr()) {
    log.error('There was an error generating Vue 2 compatibility.', result.error)
    process.exit()
  }

  log.success('Libraries are now Vue 2 & 3 compatible')
}

export async function webTypes(options?: GeneratorOptions) {
  const result = await runNpmScript(NpmScript.GenerateWebTypes, options)

  if (result.isErr()) {
    log.error('There was an error generating the web-types.json file.', result.error)
    process.exit()
  }

  log.success('Successfully generated the web-types.json file')
}

export async function vsCodeCustomData(options?: GeneratorOptions) {
  const result = await runNpmScript(NpmScript.GenerateVsCodeCustomData, options)

  if (result.isErr()) {
    log.error('There was an error generating the custom-elements.json file.', result.error)
    process.exit()
  }

  await runAction(Action.LintFix, { verbose: true }) // the generated json file needs to be linted
  log.success('Successfully generated the custom-elements.json file')
}

export async function ideHelpers(options?: GeneratorOptions) {
  const result = await runNpmScript(NpmScript.GenerateIdeHelpers, options)

  if (result.isErr()) {
    log.error('There was an error generating IDE helpers.', result.error)
    process.exit()
  }

  await runAction(Action.LintFix, { verbose: true }) // the generated json file needs to be linted
  log.success('Successfully generated IDE helpers')
}

export async function componentMeta(options?: GeneratorOptions) {
  const result = await runNpmScript(NpmScript.GenerateComponentMeta, options)

  if (result.isErr()) {
    log.error('There was an error generating your component meta information.', result.error)
    process.exit()
  }

  await runAction(Action.LintFix, { verbose: true }) // the generated json file needs to be linted
  log.success('Successfully generated component meta information')
}

export async function types(options?: GeneratorOptions) {
  const result = await runNpmScript(NpmScript.GenerateTypes, options)

  if (result.isErr()) {
    log.error('There was an error generating your types.', result.error)
    process.exit()
  }

  log.success('Types were generated successfully')
}

export async function migrations() {
  const path = frameworkPath('database/schema.prisma')

  // await migrate(path, { database: database.driver })

  await runCommand(`npx prisma migrate dev --schema=${path}`)

  log.success('Successfully updated migrations')
}

export async function seeder() {
  await seed()
}

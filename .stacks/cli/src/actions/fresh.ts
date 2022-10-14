import consola from 'consola'
import { NpmScript } from '../../../types'
import { runNpmScript } from '../../../utils/run-npm-script'

export async function reinstallNpmDependencies() {
  consola.info('Reinstalling your npm dependencies...')
  await runNpmScript(NpmScript.Fresh)
  consola.success('Successfully reinstalled your npm dependencies.')
}

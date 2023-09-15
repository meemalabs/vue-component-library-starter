/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import { logsPath } from '@stacksjs/path'
import type { StacksError } from '@stacksjs/types'

export class ErrorHandler {
  static logFile = logsPath('errors.log')

  static handle(err: string | StacksError, options?: any) {
    if (typeof err === 'string')
      err = new Error(err)

    this.writeErrorToConsole(err, options)
    this.writeErrorToFile(err)

    return err
  }

  static handleError(err: Error, options?: any) {
    this.handle(err, options)
    return err
  }

  static async writeErrorToFile(err: StacksError) {
    const formattedError = `[${new Date().toISOString()}] ${err.name}: ${err.message}\n`
    const file = Bun.file(this.logFile)
    const writer = file.writer()
    const text = await file.text()
    writer.write(`${text}\n`)
    writer.write(`${formattedError}\n`)
    writer.end()
  }

  static writeErrorToConsole(err: string | StacksError, options?: any) {
    console.error(err, options)
  }
}

export function handleError(err: StacksError | string, options?: any): StacksError {
  if (typeof err === 'string')
    return ErrorHandler.handle(new Error(err), options) as StacksError

  return ErrorHandler.handle(err, options) as StacksError
}

function isErrorOfTypeValidation(err: any): err is ValidationError {
  return err && typeof err.message === 'string'
}

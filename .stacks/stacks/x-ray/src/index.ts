// import { ray } from 'node-ray's

import { send } from './client'
import type { Log } from './types'

function ray(content: any): void {
  const splitString = getErrorObject()?.split('/') || ['file:0']
  const splitLength = splitString?.length || 1
  const originFile = splitString[splitLength - 1]

  const log: Log = {
    content,
    file: originFile || 'file:0',
    expanded: false,
    color: 'indigo',
    time: getTime(),
  }

  send(log, '/api/store-logs')
}

function getErrorObject() {
  const callerLine: Error = (new Error('err'))

  const newLine = callerLine.stack?.split('\n')[4]
  const index = newLine?.indexOf('at ') || 0
  const fileLine = newLine?.slice(index + 2, newLine.length)

  return fileLine
}

function getTime() {
  const date = new Date()

  const seconds = date.getSeconds()
  const minutes = date.getMinutes()
  const hour = date.getHours()

  return `${hour}:${minutes}:${seconds}`
}

export { ray }

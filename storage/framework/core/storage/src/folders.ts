import { join } from '@stacksjs/path'
import { fs } from './fs'

/**
 * Determine whether a path is a folder.
 */
export function isFolder(path: string): boolean {
  try {
    return fs.statSync(path).isDirectory()
  } catch {
    return false
  }
}

export function isDirectory(path: string): boolean {
  return isFolder(path)
}

export function isDir(path: string): boolean {
  return isFolder(path)
}

export function doesFolderExist(path: string) {
  return fs.existsSync(path)
}

export function createFolder(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirs(dir, (err: any) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function getFolders(dir: string): string[] {
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(join(dir, file)).isDirectory()
  })
}

export const folders = {
  isFolder,
  doesFolderExist,
  createFolder,
  getFolders,
}

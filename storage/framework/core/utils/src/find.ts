import type { Dirent } from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { italic } from '@stacksjs/cli'
import { log } from '@stacksjs/logging'

const targetFileName = 'buddy' // The exact name of the target file

const excludePatterns = [
  'node_modules',
  'dist',
  'vendor',
  `${os.homedir()}/Documents`,
  `${os.homedir()}/Pictures`,
  `${os.homedir()}/Library`,
  `${os.homedir()}/.Trash`,
  /.*out.*|.*\.out.*|out-.*/, // exclude any folder with 'out' in the name
  /.*\/\..*/, // exclude any folder that starts with a dot
]

interface FindStacksProjectsOptions {
  quiet?: boolean
}

export async function findStacksProjects(dir?: string, options?: FindStacksProjectsOptions): Promise<string[]> {
  dir = dir || os.homedir()

  if (!options?.quiet) {
    log.info(`Searching for Stacks projects in: ${italic(dir)}`)
    log.info(`This may take a few moments...`)
    console.log('')
    console.log(italic('  Please note, while Stacks is searching for projects on your machine,'))
    console.log(italic('  you may be asked for permissions to scan certain directories.'))
    console.log('')
    log.debug(`Excluding directories: ${excludePatterns.join(', ')}`)
  }

  const foundProjects = await searchDirectory(dir)

  if (!foundProjects) throw new Error('No Stacks projects found')

  return foundProjects
}

async function searchDirectory(directory: string) {
  const foundProjects: string[] = []

  const isExcluded = excludePatterns.some((pattern) =>
    typeof pattern === 'string' ? directory.includes(pattern) : pattern.test(directory),
  )
  if (isExcluded) return

  let items: Dirent[]
  try {
    items = await fs.readdir(directory, { withFileTypes: true })
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error)
    return
  }

  let buddyFileFound = false
  let storageDirFound = false

  for (const item of items) {
    if (item.isFile() && item.name === targetFileName) {
      buddyFileFound = true
    } else if (item.isDirectory()) {
      // Recursively search in directories
      const fullPath = path.join(directory, item.name)
      if (item.name === 'storage') {
        // Check if the 'storage/framework/core/buddy/' structure exists within this directory
        try {
          const storagePath = path.join(fullPath, 'framework/core/buddy')
          await fs.access(storagePath)
          storageDirFound = true
        } catch (error) {
          // The specific directory structure does not exist
        }
      }
      await searchDirectory(fullPath)
    }
  }

  if (buddyFileFound && storageDirFound) foundProjects.push(directory) // Both conditions are met

  return foundProjects
}

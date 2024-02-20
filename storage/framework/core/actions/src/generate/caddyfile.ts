// checks for all of the Stacks projects on the system
// and generates one caddyfile for it all

// stacksjs.localhost {
//  route {
//    @libs {
//      path /libs/*
//    }

//    handle @libs {
//      reverse_proxy localhost:3003
//    }

//    @api {
//      path /api/*
//    }

//    handle @api {
//      reverse_proxy localhost:3999
//    }

//    handle {
//      reverse_proxy localhost:3000
//    }
//  }
// }

import { readdir } from 'node:fs/promises'
import { path as p } from '@stacksjs/path'
import { logger } from '@stacksjs/logging'
import { storage } from '@stacksjs/storage'

logger.log('Generating Local Reverse Proxy...')

const files = await readdir(p.appPath('Actions'), { recursive: true })

const validActions = `// This file is auto-generated by Stacks. Do not edit this file manually.
// If you wish to rename an action, please do so by editing the file name.
//
// For more information, please visit: https://stacksjs.org/docs

export type ActionPath = ${
  files
    .filter(file => file.endsWith('.ts'))
    .map(value => `'Actions/${value.replace('.ts', '')}'`)
    .join(' | ')
}
`

await storage.writeFile(p.frameworkPath('types/actions.d.ts'), validActions)

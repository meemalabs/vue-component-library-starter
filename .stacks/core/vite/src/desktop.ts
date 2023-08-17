import { type ViteConfig } from '@stacksjs/types'
import * as p from '@stacksjs/path'
import { alias } from '@stacksjs/alias'

// import mkcert from 'vite-plugin-mkcert'
import * as c from 'kolorist'
import pkgjson from '../package.json'
import app from '../../../../config/app'
import { cssEngine, inspect, layouts, pages, uiEngine } from './stacks'
import { type ViteDevServer as DevServer } from './'
import { defineConfig } from './'

// import library from '../../../../config/library'

const { version } = pkgjson

export const vueComponentsConfig: ViteConfig = {
  root: p.frameworkPath('views/desktop/dashboard'),
  envDir: p.projectPath(),
  envPrefix: 'FRONTEND_',
  publicDir: p.projectStoragePath('public'),

  server: {
    // https: true,
    host: '127.0.0.1',
    open: true,
  },

  resolve: {
    dedupe: ['vue'],
    alias,
  },

  optimizeDeps: {
    exclude: ['vue'],
  },

  plugins: [
    // preview(),
    pages({
      routesFolder: ['../../stacks/dashboard/src/pages'],
    }),
    layouts({
      layoutsDirs: '../../../stacks/dashboard/src/layouts',
    }),
    uiEngine(),
    cssEngine(),
    inspect(),
    // mkcert({
    //   hosts: ['localhost', 'stacks.test', 'api.stacks.test', 'admin.stacks.test', 'libs.stacks.test', 'docs.stacks.test'],
    //   autoUpgrade: true,
    //   savePath: p.frameworkPath('certs/components'),
    //   keyFileName: library.name ? `library-${library.name}-key.pem` : 'library-key.pem',
    //   certFileName: library.name ? `library-${library.name}-cert.pem` : 'library-cert.pem',
    // }),

    // @ts-expect-error TODO: fix this
    {
      // ...
      configureServer(server: DevServer) {
        // const base = server.config.base || '/'
        // const _print = server.printUrls
        server.printUrls = () => {
          // const url = server.resolvedUrls?.local[0]
          //
          // if (url) {
          //   try {
          //     const u = new URL(url)
          //     // eslint-disable-next-line no-console
          //     console.log(`${u.protocol}//${u.host}`)
          //     // const host = `${u.protocol}//${u.host}`
          //   }
          //   catch (error) {
          //     log.warn('Parse resolved url failed:', error)
          //   }
          // }

          const appUrl = app.url
          const frontendUrl = `https://${appUrl}`
          const backendUrl = `https://api.${appUrl}`
          const dashboardUrl = `https://admin.${appUrl}`
          const libraryUrl = `https://libs.${appUrl}`
          const docsUrl = `https://docs.${appUrl}`
          const inspectUrl = `https://${appUrl}/__inspect/`

          // const pkg = await storage.readPackageJson(frameworkPath('./package.json')) // TODO: fix this async call placing `press h to show help` on top
          const stacksVersion = `alpha-${version}`

          // eslint-disable-next-line no-console
          console.log(`  ${c.blue(c.bold('STACKS'))} ${c.blue(stacksVersion)}`)
          // eslint-disable-next-line no-console
          console.log(`  ${c.green('➜')}  ${c.bold('Frontend')}: ${c.green(frontendUrl)}`)
          // eslint-disable-next-line no-console
          console.log(`  ${c.green('➜')}  ${c.bold('Backend')}: ${c.green(backendUrl)}`)
          // eslint-disable-next-line no-console
          console.log(`  ${c.green('➜')}  ${c.bold('Dashboard')}: ${c.green(dashboardUrl)}`)
          // eslint-disable-next-line no-console
          console.log(`  ${c.green('➜')}  ${c.bold('Library')}: ${c.green(libraryUrl)}`)
          // eslint-disable-next-line no-console
          console.log(`  ${c.green('➜')}  ${c.bold('Docs')}: ${c.green(docsUrl)}`)
          // eslint-disable-next-line no-console
          console.log(`  ${c.green('➜')}  ${c.dim('Inspect')}: ${c.green(inspectUrl)}`)
        }
      },
    },
  ],
}

export default defineConfig(({ command }) => {
  // process.env = { ...process.env, ...loadEnv(mode, projectPath(), '') }

  if (command === 'serve')
    return vueComponentsConfig

  return vueComponentsConfig
})

import dts from 'bun-plugin-dts-auto'
import { log } from '@stacksjs/logging'

log.info(`Building @stacksjs/cache...`)

await Bun.build({
  entrypoints: ['./src/index.ts'],

  outdir: './dist',
  format: 'esm',
  target: 'bun',

  external: [
    'ioredis',
    '@stacksjs/config',
  ],

  plugins: [
    dts({
      cwd: import.meta.dir,
    }),
  ],
})

log.success(`Built @stacksjs/cache`)

import type { ViteConfig } from '../core'
import type { BuildOptions as ViteBuildOptions } from 'vite'
import { defineConfig, Stacks } from '../core'
import alias from '../../../config/alias'
import { resolve } from 'path'
import library from '../../../config/library'

// https://vitejs.dev/config/
const config: ViteConfig = {
  resolve: {
    dedupe: ['vue'],
    alias,
  },

  // optimizeDeps: {
  //   exclude: ['vue', '@vueuse/core'],
  // },

  plugins: [
    Stacks(),
  ],

  build: buildOptions(),
}

export default defineConfig(({ command }) => {
  if (command === 'serve')
    return config

  // command === 'build'
  return config
})

export function buildOptions(entry?: string): ViteBuildOptions {
  if (!entry)
    entry = resolve(__dirname, '../../../components/src/index.ts')

  return {
    outDir: resolve(__dirname, '../../../components/dist'),

    lib: {
      entry,
      name: library.VUE_PACKAGE_NAME,
      formats: ['cjs', 'es'],
      fileName: (format: string) => {
        if (format === 'es')
          return `index.mjs`

        if (format === 'cjs')
          return `index.cjs`

        // if (format === 'iife')
        //     return `index.iife.js`

        return `index.?.js`
      },
    },
    
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        // exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },

    // sourcemap: true,
    // minify: false,
  }
}

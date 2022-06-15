import path from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
// import { buildVueComponents as vueComponents, plugins } from '../composables/src/stacks'
// import { Stacks, resolveOptions } from '../core/src'
import Vue from '@vitejs/plugin-vue'
import Typescript2 from 'rollup-plugin-typescript2'
import { VUE_PACKAGE_NAME } from '../../config/constants'
// import { alias } from '../core/src'

// eslint-disable-next-line no-console
console.log('here')

// https://vitejs.dev/config/
const config: UserConfig = {
  root: path.resolve(__dirname, './src'),

  resolve: {
    dedupe: ['vue'],
    // alias,
  },

  plugins: [
    Vue(),

    {
      ...Typescript2(),
      apply: 'build',
    },
  ],

  optimizeDeps: {
    // exclude: ['path', 'fs', 'url', 'crypto']
    exclude: ['@vueuse/core', 'vue', 'unocss'],
  },

  build: {
    lib: {
      entry: path?.resolve(__dirname, 'src/index.ts') || 'src/index.ts',
      name: VUE_PACKAGE_NAME,
      fileName: format => `${VUE_PACKAGE_NAME}.${format}.js`,
    },

    rollupOptions: {
      external: ['@vueuse/core', 'vue', 'unocss'],

      output: {
        // exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },

    // sourcemap: true,
    // minify: true,
  },
}

// eslint-disable-next-line no-console
console.log('config', config)

// https://vitejs.dev/config
export default defineConfig(({ command }) => {
  // // eslint-disable-next-line no-console
  // console.log('config is', config)

  if (command === 'serve')
    return config

  // command === 'build'
  return config
})

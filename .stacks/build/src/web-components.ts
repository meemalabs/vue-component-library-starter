import type { BuildOptions as ViteBuildOptions } from 'vite'
import { defineConfig } from 'vite'
import type { ViteConfig } from 'types'
import { library } from 'config'
import { alias, buildEntriesPath, componentsPath, frameworkPath, projectPath } from 'utils'
import { atomicCssEngine, autoImports, components, inspect, uiEngine } from './'

const isWebComponent = true

export const webComponentsConfig: ViteConfig = {
  root: componentsPath(),
  envDir: projectPath(),
  envPrefix: 'APP_',

  server: {
    port: 3333,
    open: true,
  },

  resolve: {
    alias,
  },

  plugins: [
    inspect(),
    uiEngine(isWebComponent),
    atomicCssEngine(isWebComponent),
    autoImports(),
    components(),
  ],

  build: webComponentsBuildOptions(),
}

export function webComponentsBuildOptions(): ViteBuildOptions {
  return {
    outDir: frameworkPath('web-components/dist'),
    emptyOutDir: true,
    lib: {
      entry: buildEntriesPath('web-components.ts'),
      name: library.webComponents.name,
      formats: ['cjs', 'es'],
      fileName: (format: string) => {
        if (format === 'es')
          return 'index.mjs'

        if (format === 'cjs')
          return 'index.cjs'

        return 'index.?.js'
      },
    },
  }
}

export default defineConfig(({ command }) => {
  if (command === 'serve')
    return webComponentsConfig

  // command === 'build'
  return webComponentsConfig
})

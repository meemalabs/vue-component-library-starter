import { defu } from 'defu'
import type { Options, TreeNode } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'

// https://github.com/posva/unplugin-vue-router
export function pages(options?: Options) {
  const defaultOptions = {
    extensions: ['.stx', '.vue', '.md'],
    getRouteName: (routeNode: TreeNode) => getFileBasedRouteName(routeNode),
  }

  const newOptions = defu(options, defaultOptions)

  return VueRouter(newOptions)
}

function getFileBasedRouteName(node: TreeNode): string {
  // Base case: If node doesn't have a parent, return an empty string
  if (!node.parent) return ''

  // Recursive case: Concatenate the parent's value with the current node's value
  const segment = node.value.rawSegment === 'index' ? '' : node.value.rawSegment

  const path =
    getFileBasedRouteName(node.parent) + (segment ? `/${segment}` : '')

  // Process the path to get the desired format
  const cleanedPath = path
    .replace(/^\//, '') // Remove leading slash
    .replace(/\//g, '.') // Replace all remaining slashes with dots
    .replace(/\[|\]/g, '') // Remove [ and ]

  return cleanedPath
}

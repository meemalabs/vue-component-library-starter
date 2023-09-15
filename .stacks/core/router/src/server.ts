import { URL } from 'node:url'
import { extname } from 'node:path'
import type { MiddlewareType, Route, StatusCode } from '@stacksjs/types'
import { middlewares } from './middleware'
import { request } from './request'
import { route } from './index'

const routesList: Route[] = await route.getRoutes()

Bun.serve({
  async fetch(req: Request) {
    return serverResponse(req)
  },
})

export function serverResponse(req: Request) {
  const url = new URL(req.url)

  const foundRoute: Route | undefined = routesList.find((route: Route) => {
    const pattern = new RegExp(`^${route.uri.replace(/:\w+/g, '\\w+')}$`)

    return pattern.test(url.pathname)
  })

  if (url.pathname === '/favicon.ico')
    return new Response('')

  if (!foundRoute)
    return new Response('Not found', { status: 404 })

  addRouteParamsAndQuery(url, foundRoute)
  executeMiddleware(foundRoute)

  return execute(foundRoute, req, { statusCode: foundRoute?.statusCode })
}

function addRouteParamsAndQuery(url: URL, route: Route): void {
  if (!isObjectNotEmpty(url.searchParams))
    request.addQuery(url)

  request.extractParamsFromRoute(route.uri, url.pathname)
}

function executeMiddleware(route: Route): void {
  const { middleware = null } = route

  if (middleware && middlewares && isObjectNotEmpty(middlewares)) {
    if (isString(middleware)) {
      const middlewareItem: MiddlewareType = middlewares.find((middlewareItem: MiddlewareType) => {
        return middlewareItem.name === middleware
      })

      if (middlewareItem)
        middlewareItem.handle() // Invoke only if it exists and is not undefined.
    }
    else {
      middleware.forEach((m) => {
        const middlewareItem: MiddlewareType = middlewares.find((middlewareItem: MiddlewareType) => {
          return middlewareItem.name === m
        })

        if (middlewareItem)
          middlewareItem.handle() // Again, invoke only if it exists.
      })
    }
  }
}

interface Options {
  statusCode?: StatusCode
}

function execute(route: Route, request: Request, { statusCode }: Options) {
  if (!statusCode)
    statusCode = 200

  if (route?.method === 'GET' && (statusCode === 301 || statusCode === 302)) {
    const callback = String(route.callback)

    const response = Response.redirect(callback, statusCode)

    return noCache(response)
  }

  if (route?.method !== request.method)
    return new Response('Method not allowed', { status: 405 })

  // Check if it's a path to an HTM L file
  if (isString(route.callback) && extname(route.callback) === '.html') {
    try {
      const fileContent = Bun.file(route.callback)

      return new Response(fileContent, { headers: { 'Content-Type': 'text/html' } })
    }
    catch (error) {
      return new Response('Error reading the HTML file', { status: 500 })
    }
  }

  if (isString(route.callback))
    return new Response(route.callback)

  if (isFunction(route.callback)) {
    const result = (route.callback)()
    return new Response(JSON.stringify(result))
  }

  if (isObject(route.callback))
    return new Response(JSON.stringify(route.callback))

  // If no known type matched, return a generic error.
  return new Response('Unknown callback type.', { status: 500 })
}

function noCache(response: Response) {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  return response
}

function isString(val: unknown): val is string {
  return typeof val === 'string'
}

function isObjectNotEmpty(obj: object): boolean {
  return Object.keys(obj).length > 0
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

function isObject(val: unknown): val is object {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

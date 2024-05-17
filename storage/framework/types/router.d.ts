/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...all]': RouteRecordInfo<'/[...all]', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/about': RouteRecordInfo<'/about', '/about', Record<never, never>, Record<never, never>>,
    '/dashboard/': RouteRecordInfo<'/dashboard/', '/dashboard', Record<never, never>, Record<never, never>>,
    '/dashboard/actions/': RouteRecordInfo<'/dashboard/actions/', '/dashboard/actions', Record<never, never>, Record<never, never>>,
    '/dashboard/buddy/': RouteRecordInfo<'/dashboard/buddy/', '/dashboard/buddy', Record<never, never>, Record<never, never>>,
    '/dashboard/commands/': RouteRecordInfo<'/dashboard/commands/', '/dashboard/commands', Record<never, never>, Record<never, never>>,
    '/dashboard/components/': RouteRecordInfo<'/dashboard/components/', '/dashboard/components', Record<never, never>, Record<never, never>>,
    '/dashboard/dependencies/': RouteRecordInfo<'/dashboard/dependencies/', '/dashboard/dependencies', Record<never, never>, Record<never, never>>,
    '/dashboard/deployments/': RouteRecordInfo<'/dashboard/deployments/', '/dashboard/deployments', Record<never, never>, Record<never, never>>,
    '/dashboard/deployments/[id]': RouteRecordInfo<'/dashboard/deployments/[id]', '/dashboard/deployments/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/dashboard/dns/': RouteRecordInfo<'/dashboard/dns/', '/dashboard/dns', Record<never, never>, Record<never, never>>,
    '/dashboard/emails/': RouteRecordInfo<'/dashboard/emails/', '/dashboard/emails', Record<never, never>, Record<never, never>>,
    '/dashboard/environment/': RouteRecordInfo<'/dashboard/environment/', '/dashboard/environment', Record<never, never>, Record<never, never>>,
    '/dashboard/functions/': RouteRecordInfo<'/dashboard/functions/', '/dashboard/functions', Record<never, never>, Record<never, never>>,
    '/dashboard/health/': RouteRecordInfo<'/dashboard/health/', '/dashboard/health', Record<never, never>, Record<never, never>>,
    '/dashboard/jobs/': RouteRecordInfo<'/dashboard/jobs/', '/dashboard/jobs', Record<never, never>, Record<never, never>>,
    '/dashboard/logs/': RouteRecordInfo<'/dashboard/logs/', '/dashboard/logs', Record<never, never>, Record<never, never>>,
    '/dashboard/models/': RouteRecordInfo<'/dashboard/models/', '/dashboard/models', Record<never, never>, Record<never, never>>,
    '/dashboard/models/subscribers': RouteRecordInfo<'/dashboard/models/subscribers', '/dashboard/models/subscribers', Record<never, never>, Record<never, never>>,
    '/dashboard/models/teams': RouteRecordInfo<'/dashboard/models/teams', '/dashboard/models/teams', Record<never, never>, Record<never, never>>,
    '/dashboard/models/users': RouteRecordInfo<'/dashboard/models/users', '/dashboard/models/users', Record<never, never>, Record<never, never>>,
    '/dashboard/notifications/': RouteRecordInfo<'/dashboard/notifications/', '/dashboard/notifications', Record<never, never>, Record<never, never>>,
    '/dashboard/releases/': RouteRecordInfo<'/dashboard/releases/', '/dashboard/releases', Record<never, never>, Record<never, never>>,
    '/dashboard/requests/': RouteRecordInfo<'/dashboard/requests/', '/dashboard/requests', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/billing': RouteRecordInfo<'/dashboard/settings/billing', '/dashboard/settings/billing', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/cache': RouteRecordInfo<'/dashboard/settings/cache', '/dashboard/settings/cache', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/database': RouteRecordInfo<'/dashboard/settings/database', '/dashboard/settings/database', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/mail': RouteRecordInfo<'/dashboard/settings/mail', '/dashboard/settings/mail', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/queue': RouteRecordInfo<'/dashboard/settings/queue', '/dashboard/settings/queue', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/services': RouteRecordInfo<'/dashboard/settings/services', '/dashboard/settings/services', Record<never, never>, Record<never, never>>,
    '/dashboard/settings/storage': RouteRecordInfo<'/dashboard/settings/storage', '/dashboard/settings/storage', Record<never, never>, Record<never, never>>,
    '/dashboard/teams/[id]': RouteRecordInfo<'/dashboard/teams/[id]', '/dashboard/teams/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/errors/400': RouteRecordInfo<'/errors/400', '/errors/400', Record<never, never>, Record<never, never>>,
    '/errors/403': RouteRecordInfo<'/errors/403', '/errors/403', Record<never, never>, Record<never, never>>,
    '/errors/404': RouteRecordInfo<'/errors/404', '/errors/404', Record<never, never>, Record<never, never>>,
    '/errors/405': RouteRecordInfo<'/errors/405', '/errors/405', Record<never, never>, Record<never, never>>,
    '/errors/414': RouteRecordInfo<'/errors/414', '/errors/414', Record<never, never>, Record<never, never>>,
    '/errors/416': RouteRecordInfo<'/errors/416', '/errors/416', Record<never, never>, Record<never, never>>,
    '/errors/500': RouteRecordInfo<'/errors/500', '/errors/500', Record<never, never>, Record<never, never>>,
    '/errors/501': RouteRecordInfo<'/errors/501', '/errors/501', Record<never, never>, Record<never, never>>,
    '/errors/502': RouteRecordInfo<'/errors/502', '/errors/502', Record<never, never>, Record<never, never>>,
    '/errors/503': RouteRecordInfo<'/errors/503', '/errors/503', Record<never, never>, Record<never, never>>,
    '/errors/504': RouteRecordInfo<'/errors/504', '/errors/504', Record<never, never>, Record<never, never>>,
    '/hello-world/[name]': RouteRecordInfo<'/hello-world/[name]', '/hello-world/:name', { name: ParamValue<true> }, { name: ParamValue<false> }>,
    '/README': RouteRecordInfo<'/README', '/README', Record<never, never>, Record<never, never>>,
    '/system-tray/': RouteRecordInfo<'/system-tray/', '/system-tray', Record<never, never>, Record<never, never>>,
  }
}

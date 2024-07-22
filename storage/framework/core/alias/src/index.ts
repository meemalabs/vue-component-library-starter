/**
 * The following configuration references local aliases.
 */

import { path as p } from '@stacksjs/path'

export const alias: Record<string, string> = {
  '@stacksjs/ai': p.aiPath('src/index.ts'),
  '@stacksjs/ai/*': p.aiPath('src/*'),
  '@stacksjs/actions': p.actionsPath('src/index.ts'),
  '@stacksjs/actions/*': p.actionsPath('src/*'),
  '@stacksjs/alias': p.aliasPath(),
  '@stacksjs/analytics': p.analyticsPath('src/index.ts'),
  '@stacksjs/analytics/*': p.analyticsPath('src/*'),
  '@stacksjs/arrays': p.arraysPath('src/index.ts'),
  '@stacksjs/arrays/*': p.arraysPath('src/*'),
  '@stacksjs/auth': p.authPath('src/index.ts'),
  '@stacksjs/auth/*': p.authPath('src/*'),
  '@stacksjs/build': p.buildPath('src/index.ts'),
  '@stacksjs/build/*': p.buildPath('src/*'),
  '@stacksjs/cache': p.cachePath('src/index.ts'),
  '@stacksjs/cache/*': p.cachePath('src/*'),
  '@stacksjs/chat': p.chatPath('src/index.ts'),
  '@stacksjs/chat/*': p.chatPath('src/*'),
  '@stacksjs/cli': p.cliPath('src/index.ts'),
  '@stacksjs/cli/*': p.cliPath('src/*'),
  '@stacksjs/cloud': p.cloudPath('src/index.ts'),
  '@stacksjs/cloud/*': p.cloudPath('src/*'),
  '@stacksjs/collections': p.collectionsPath('src/index.ts'),
  '@stacksjs/collections/*': p.collectionsPath('src/*'),
  '@stacksjs/config': p.configPath('src/index.ts'),
  '@stacksjs/config/*': p.configPath('src/*'),
  '@stacksjs/database': p.databasePath('src/index.ts'),
  '@stacksjs/database/*': p.databasePath('src/*'),
  '@stacksjs/datetime': p.datetimePath('src/index.ts'),
  '@stacksjs/datetime/*': p.datetimePath('src/*'),
  '@stacksjs/development': p.developmentPath('src/index.ts'),
  '@stacksjs/development/*': p.developmentPath('src/*'),
  '@stacksjs/desktop': p.desktopPath('src/index.ts'),
  '@stacksjs/desktop/*': p.desktopPath('src/*'),
  '@stacksjs/dns': p.dnsPath('src/index.ts'),
  '@stacksjs/dns/*': p.dnsPath('src/*'),
  '@stacksjs/docs': p.docsPath('src/index.ts'),
  '@stacksjs/docs/*': p.docsPath('src/*'),
  '@stacksjs/email': p.emailPath('src/index.ts'),
  '@stacksjs/email/*': p.emailPath('src/*'),
  '@stacksjs/enums': p.enumsPath('src/index.ts'),
  '@stacksjs/enums/*': p.enumsPath('src/*'),
  '@stacksjs/env': p.coreEnvPath('src/index.ts'),
  '@stacksjs/env/*': p.coreEnvPath('src/*'),
  '@stacksjs/error-handling': p.errorHandlingPath('src/index.ts'),
  '@stacksjs/error-handling/*': p.errorHandlingPath('src/*'),
  '@stacksjs/events': p.eventsPath('src/index.ts'),
  '@stacksjs/events/*': p.eventsPath('src/*'),
  '@stacksjs/faker': p.fakerPath('src/index.ts'),
  '@stacksjs/faker/*': p.fakerPath('src/*'),
  '@stacksjs/git': p.gitPath('src/index.ts'),
  '@stacksjs/git/*': p.gitPath('src/*'),
  '@stacksjs/lint': p.lintPath('src/index.ts'),
  '@stacksjs/lint/*': p.lintPath('src/*'),
  '@stacksjs/logging': p.loggingPath('src/index.ts'),
  '@stacksjs/logging/*': p.loggingPath('src/*'),
  '@stacksjs/notifications': p.notificationsPath('src/index.ts'),
  '@stacksjs/notifications/*': p.notificationsPath('src/*'),
  '@stacksjs/objects': p.objectsPath('src/index.ts'),
  '@stacksjs/objects/*': p.objectsPath('src/*'),
  '@stacksjs/orm': p.ormPath('src/index.ts'),
  '@stacksjs/orm/*': p.ormPath('src/*'),
  '@stacksjs/path': p.pathPath('src/index.ts'), // 🤦🏼‍♂️
  '@stacksjs/path/*': p.pathPath('src/*'),
  '@stacksjs/push': p.pushPath('src/index.ts'),
  '@stacksjs/push/*': p.pushPath('src/*'),
  '@stacksjs/queue': p.queuePath('src/index.ts'),
  '@stacksjs/queue/*': p.queuePath('src/*'),
  '@stacksjs/query-builder': p.queryBuilderPath('src/index.ts'),
  '@stacksjs/query-builder/*': p.queryBuilderPath('src/*'),
  '@stacksjs/repl': p.replPath('src/index.ts'),
  '@stacksjs/repl/*': p.replPath('src/*'),
  '@stacksjs/router': p.routerPath('src/index.ts'),
  '@stacksjs/router/*': p.routerPath('src/*'),
  '@stacksjs/search-engine': p.searchEnginePath('src/index.ts'),
  '@stacksjs/search-engine/*': p.searchEnginePath('src/*'),
  '@stacksjs/security': p.securityPath('src/index.ts'),
  '@stacksjs/security/*': p.securityPath('src/*'),
  '@stacksjs/server': p.serverPath('src/index.ts'),
  '@stacksjs/server/*': p.serverPath('src/*'),
  '@stacksjs/slug': p.slugPath('src/index.ts'),
  '@stacksjs/slug/*': p.slugPath('src/*'),
  '@stacksjs/sms': p.smsPath('src/index.ts'),
  '@stacksjs/sms/*': p.smsPath('src/*'),
  '@stacksjs/scheduler': p.schedulerPath('src/index.ts'),
  '@stacksjs/scheduler/*': p.schedulerPath('src/*'),
  '@stacksjs/storage': p.storagePath('src/index.ts'),
  '@stacksjs/storage/*': p.storagePath('src/*'),
  '@stacksjs/strings': p.stringsPath('src/index.ts'),
  '@stacksjs/strings/*': p.stringsPath('src/*'),
  '@stacksjs/testing/*': p.testingPath('*'),
  '@stacksjs/tinker': p.tinkerPath('src/index.ts'),
  '@stacksjs/tinker/*': p.tinkerPath('src/*'),
  '@stacksjs/types': p.typesPath('src/index.ts'),
  '@stacksjs/types/*': p.typesPath('src/*'),
  '@stacksjs/ui': p.uiPath('src/index.ts'),
  '@stacksjs/ui/*': p.uiPath('src/*'),
  '@stacksjs/utils': p.utilsPath('src/index.ts'),
  '@stacksjs/utils/*': p.utilsPath('src/*'),
  '@stacksjs/validation': p.validationPath('src/index.ts'),
  '@stacksjs/validation/*': p.validationPath('src/*'),
  '@stacksjs/vite-config': p.viteConfigPath('src/index.ts'),
  '@stacksjs/vite-config/*': p.viteConfigPath('src/*'),
  '@stacksjs/vite-plugin': p.vitePluginPath('src/index.ts'),
  '@stacksjs/vite-plugin/*': p.vitePluginPath('src/*'),
  '@stacksjs/x-ray': p.xRayPath('src/index.ts'),
  '@stacksjs/x-ray/*': p.xRayPath('src/*'),

  'framework/*': p.frameworkPath('*'),
  stacks: p.frameworkPath('src/index.ts'),
  'stacks/ai': p.aiPath('src/index.ts'),
  'stacks/ai/*': p.aiPath('src/*'),
  'stacks/actions': p.actionsPath('src/index.ts'),
  'stacks/actions/*': p.actionsPath('src/*'),
  'stacks/alias': p.aliasPath(),
  'stacks/arrays': p.arraysPath('src/index.ts'),
  'stacks/arrays/*': p.arraysPath('src/*'),
  'stacks/auth': p.authPath('src/index.ts'),
  'stacks/auth/*': p.authPath('src/*'),
  'stacks/build': p.buildPath('src/index.ts'),
  'stacks/build/*': p.buildPath('src/*'),
  'stacks/cache': p.cachePath('src/index.ts'),
  'stacks/cache/*': p.cachePath('src/*'),
  'stacks/chat': p.chatPath('src/index.ts'),
  'stacks/chat/*': p.chatPath('src/*'),
  'stacks/cli': p.cliPath('src/index.ts'),
  'stacks/cli/*': p.cliPath('src/*'),
  'stacks/cloud': p.cloudPath('src/index.ts'),
  'stacks/cloud/*': p.cloudPath('src/*'),
  'stacks/collections': p.collectionsPath('src/index.ts'),
  'stacks/collections/*': p.collectionsPath('src/*'),
  'stacks/config': p.configPath('src/index.ts'),
  'stacks/config/*': p.configPath('src/*'),
  'stacks/database': p.databasePath('src/index.ts'),
  'stacks/database/*': p.databasePath('src/*'),
  'stacks/development': p.developmentPath('src/index.ts'),
  'stacks/development/*': p.developmentPath('src/*'),
  'stacks/desktop': p.desktopPath('src/index.ts'),
  'stacks/desktop/*': p.desktopPath('src/*'),
  'stacks/dns': p.dnsPath('src/index.ts'),
  'stacks/dns/*': p.dnsPath('src/*'),
  'stacks/docs': p.docsPath('src/index.ts'),
  'stacks/docs/*': p.docsPath('src/*'),
  'stacks/email': p.emailPath('src/index.ts'),
  'stacks/email/*': p.emailPath('src/*'),
  'stacks/error-handling': p.errorHandlingPath('src/index.ts'),
  'stacks/error-handling/*': p.errorHandlingPath('src/*'),
  'stacks/events': p.eventsPath('src/index.ts'),
  'stacks/events/*': p.eventsPath('src/*'),
  'stacks/faker': p.fakerPath('src/index.ts'),
  'stacks/faker/*': p.fakerPath('src/*'),
  'stacks/git': p.gitPath('src/index.ts'),
  'stacks/git/*': p.gitPath('src/*'),
  'stacks/lint': p.lintPath('src/index.ts'),
  'stacks/lint/*': p.lintPath('src/*'),
  'stacks/logging': p.loggingPath('src/index.ts'),
  'stacks/logging/*': p.loggingPath('src/*'),
  'stacks/notifications': p.notificationsPath('src/index.ts'),
  'stacks/notifications/*': p.notificationsPath('src/*'),
  'stacks/objects': p.objectsPath('src/index.ts'),
  'stacks/objects/*': p.objectsPath('src/*'),
  'stacks/orm': p.ormPath('src/index.ts'),
  'stacks/orm/*': p.ormPath('src/*'),
  'stacks/path': p.pathPath('src/index.ts'), // 🤦🏼‍♂️
  'stacks/path/*': p.pathPath('src/*'),
  'stacks/push': p.pushPath('src/index.ts'),
  'stacks/push/*': p.pushPath('src/*'),
  'stacks/query-builder': p.queryBuilderPath('src/index.ts'),
  'stacks/query-builder/*': p.queryBuilderPath('src/*'),
  'stacks/repl': p.replPath('src/index.ts'),
  'stacks/repl/*': p.replPath('src/*'),
  'stacks/router': p.routerPath('src/index.ts'),
  'stacks/router/*': p.routerPath('src/*'),
  'stacks/search-engine': p.searchEnginePath('src/index.ts'),
  'stacks/search-engine/*': p.searchEnginePath('src/*'),
  'stacks/security': p.securityPath('src/index.ts'),
  'stacks/security/*': p.securityPath('src/*'),
  'stacks/server': p.serverPath('src/index.ts'),
  'stacks/server/*': p.serverPath('src/*'),
  'stacks/sms': p.smsPath('src/index.ts'),
  'stacks/sms/*': p.smsPath('src/*'),
  'stacks/scheduler': p.schedulerPath('src/index.ts'),
  'stacks/scheduler/*': p.schedulerPath('src/*'),
  'stacks/storage': p.storagePath('src/index.ts'),
  'stacks/storage/*': p.storagePath('src/*'),
  'stacks/strings': p.stringsPath('src/index.ts'),
  'stacks/strings/*': p.stringsPath('src/*'),
  'stacks/testing/*': p.testingPath('*'),
  'stacks/tinker': p.tinkerPath('src/index.ts'),
  'stacks/tinker/*': p.tinkerPath('src/*'),
  'stacks/types': p.typesPath('src/index.ts'),
  'stacks/types/*': p.typesPath('src/*'),
  'stacks/ui': p.uiPath('src/index.ts'),
  'stacks/ui/*': p.uiPath('src/*'),
  'stacks/utils': p.utilsPath('src/index.ts'),
  'stacks/utils/*': p.utilsPath('src/*'),
  'stacks/validation': p.validationPath('src/index.ts'),
  'stacks/validation/*': p.validationPath('src/*'),
  'stacks/vite-config': p.viteConfigPath('src/index.ts'),
  'stacks/vite-config/*': p.viteConfigPath('src/*'),
  'stacks/vite-plugin': p.vitePluginPath('src/index.ts'),
  'stacks/vite-plugin/*': p.vitePluginPath('src/*'),
  'stacks/x-ray': p.xRayPath('src/index.ts'),
  'stacks/x-ray/*': p.xRayPath('src/*'),
  '~/app/*': p.appPath('*'),
  '~/config/ai': p.projectConfigPath('ai.ts'),
  '~/config/analytics': p.projectConfigPath('analytics.ts'),
  '~/config/api': p.projectConfigPath('api.ts'),
  '~/config/app': p.projectConfigPath('app.ts'),
  '~/config/cache': p.projectConfigPath('cache.ts'),
  '~/config/cli': p.projectConfigPath('cli.ts'),
  '~/config/cloud': p.projectConfigPath('cloud.ts'),
  '~/config/database': p.projectConfigPath('database.ts'),
  '~/config/dns': p.projectConfigPath('dns.ts'),
  '~/config/docs': p.docsPath('config.ts'),
  '~/config/email': p.projectConfigPath('email.ts'),
  '~/config/git': p.projectConfigPath('git.ts'),
  '~/config/hashing': p.projectConfigPath('hashing.ts'),
  '~/config/library': p.projectConfigPath('library.ts'),
  '~/config/logger': p.projectConfigPath('logger.ts'),
  '~/config/notification': p.projectConfigPath('notification.ts'),
  '~/config/payment': p.projectConfigPath('payment.ts'),
  '~/config/ports': p.projectConfigPath('ports.ts'),
  '~/config/queue': p.projectConfigPath('queue.ts'),
  '~/config/search-engine': p.projectConfigPath('search-engine.ts'),
  '~/config/security': p.projectConfigPath('security.ts'),
  '~/config/services': p.projectConfigPath('services.ts'),
  '~/config/storage': p.projectConfigPath('storage.ts'),
  '~/config/team': p.projectConfigPath('team.ts'),
  '~/config/ui': p.projectConfigPath('ui.ts'),
  '~/lang/*': p.langPath('*'),
  '~/components/*': p.componentsPath('*'),
  '~/functions/*': p.functionsPath('*'),
  '~/resources/*': p.resourcesPath('*'),
  '~/views': p.viewsPath(),
  '~/views/*': p.viewsPath('*'),
  '~/*': p.projectPath('*'),
}

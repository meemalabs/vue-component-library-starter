import { consola, italic, spawn } from '@stacksjs/cli'
import { writeTextFile } from '@stacksjs/storage'
import { resolve } from '@stacksjs/path'
import type { MakeOptions } from '@stacksjs/types'

export async function invoke(options: MakeOptions) {
  if (options.component)
    await component(options)

  if (options.database)
    await database(options)

  if (options.factory)
    await factory(options)

  if (options.function)
    await fx(options)

  if (options.language)
    await language(options)

  if (options.migration)
    await migration(options)

  if (options.notification)
    await notification(options)

  if (options.page)
    await page(options)

  if (options.stack)
    await stack(options)
}

export async function component(options: MakeOptions) {
  try {
    const name = options.name
    consola.info('Creating your component...')
    await createComponent(options)
    consola.success(`Created the ${italic(name)} component.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createComponent(options: MakeOptions) {
  const name = options.name
  await writeTextFile({
    path: `./components/${name}.vue`,
    data: `<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('Hello World component created')
</script>

<template>
  <div>
    Some HTML block
  </div>
</template>
`,
  })
}

export async function database(options: MakeOptions) {
  try {
    const name = options.name
    consola.info(`Creating your ${italic(name)} database...`)
    await createDatabase(options)
    consola.success(`Created the ${italic(name)} database.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createDatabase(options: MakeOptions) {
  console.log('options', options) // wip
}

export async function factory(options: MakeOptions) {
  try {
    const name = options.name
    consola.info(`Creating your ${italic(name)} factory...`)
    await createDatabase(options)
    consola.success(`Created the ${italic(name)} factory.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createFactory(options: MakeOptions) {
  console.log('options', options) // wip
}

export async function migration(options: MakeOptions) {
  try {
    const name = options.name
    consola.info(`Creating your ${italic(name)} migration...`)
    await createDatabase(options)
    consola.success(`Created the ${italic(name)} migration.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createMigration(options: MakeOptions) {
  console.log('options', options) // wip
}

export async function notification(options: MakeOptions) {
  try {
    const name = options.name
    consola.info(`Creating your ${italic(name)} notification...`)
    await createNotification(options)
    consola.success(`Created the ${italic(name)} notification.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createNotification(options: MakeOptions) {
  console.log('options', options) // wip
}

export async function page(options: MakeOptions) {
  try {
    const name = options.name
    consola.info('Creating your component...')
    createPage(options)
    consola.success(`Created the ${name} page.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createPage(options: MakeOptions) {
  const name = options.name
  await writeTextFile({
    path: `./pages/${name}.vue`,
    data:
`<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('Hello World page created')
</script>

<template>
  <div>
    Visit http://127.0.0.1/${name}
  </div>
</template>
`,
  })
}

export async function fx(options: MakeOptions) {
  try {
    const name = options.name
    consola.info('Creating your function...')
    createFunction(options)
    consola.success(`Created the ${name} function.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createFunction(options: MakeOptions) {
  const name = options.name
  await writeTextFile({
    path: `./functions/${name}.ts`,
    data: `// reactive state
const ${name} = ref(0)

// functions that mutate state and trigger updates
function increment() {
  ${name}.value++
}

export {
  ${name},
  increment,
}
`,
  })
}

export async function language(options: MakeOptions) {
  try {
    const name = options.name
    consola.info('Creating your translation file...')
    createLanguage(options)
    consola.success(`Created the ${name} translation file.`)
  }
  catch (err) {
    consola.error(err)
  }
}

export async function createLanguage(options: MakeOptions) {
  const name = options.name
  await writeTextFile({
    path: `./lang/${name}.yml`,
    data: `button:
  text: Copy
`,
  })
}

export async function stack(options: MakeOptions) {
  try {
    const name = options.name
    consola.info('Creating your stack...')
    const path = resolve(process.cwd(), name)
    await spawn.async(`giget stacks ${path}`)
    consola.success('Successfully scaffolded your project.')
    consola.info(`cd ${path} && pnpm install`)
  }
  catch (err) {
    consola.error(err)
  }
}

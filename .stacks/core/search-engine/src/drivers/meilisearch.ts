import { log } from '@stacksjs/cli'
import { searchEngine } from '@stacksjs/config'
import { MeiliSearch } from 'meilisearch'

interface SearchEngineOptions {
  host: string
  apiKey: string
}

function client(options: SearchEngineOptions) {
  let host = searchEngine.meilisearch?.host
  let apiKey = searchEngine.meilisearch?.apiKey

  if (options.host)
    host = options.host

  if (options.apiKey)
    apiKey = options.apiKey

  if (!host) {
    log.error('Please specify a host.')
    process.exit()
  }

  return new MeiliSearch({ host, apiKey })
}

async function search(index: string, params: any) {
  return await client
    .index(index)
    .search(params.query, { limit: params.perPage, offset: params.page * params.perPage })
}

export {
  client,
  search,
}

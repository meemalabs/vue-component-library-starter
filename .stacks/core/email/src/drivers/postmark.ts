import { PostmarkEmailProvider } from '@novu/postmark'
import type { EmailOptions } from '@stacksjs/types'
import { notification } from '@stacksjs/config/user'
import type { ResultAsync } from '@stacksjs/error-handling'
import { send as sendEmail } from '../actions/send'

const env = notification.email?.postmark

const provider = new PostmarkEmailProvider({
  apiKey: env?.key || '',
  from: env?.from || '',
})

async function send(options: EmailOptions, css?: string): Promise<ResultAsync<any, Error>> {
  return sendEmail(options, provider, 'Postmark', css)
}

export { send as Send, send }

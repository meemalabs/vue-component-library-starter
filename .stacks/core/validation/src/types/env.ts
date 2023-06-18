import process from 'node:process'
import validator from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/build/src/types'
import { loadEnv } from 'vite'
import { projectPath } from '@stacksjs/path'
import { log } from '@stacksjs/logging'

export const envPrefix: string | string[] = ['FRONTEND_', 'APP_', 'DB_', 'REDIS_', 'AWS_', 'MAIL_', 'SEARCH_ENGINE_', 'MEILISEARCH_']

// TODO: envSchema needs to be auto generated from the .env file
// envSchema could also be named "backendEnvSchema"
export const envSchema = validator.object({
  APP_NAME: validator.string().optional(),
  APP_ENV: validator.enum(['local', 'development', 'staging', 'production']).optional(),
  APP_KEY: validator.string().optional(),
  APP_URL: validator.string(),
  APP_DEBUG: validator.enum(['true', 'false']).transform(Boolean).optional(),
  APP_SUBDOMAIN_API: validator.string().optional(),
  APP_SUBDOMAIN_DOCS: validator.string().optional(),
  APP_SUBDOMAIN_LIBRARY: validator.string().optional(),
  APP_BUCKET: validator.string().optional(),

  DB_CONNECTION: validator.string().optional(),
  DB_HOST: validator.string().optional(),
  DB_PORT: validator.string().regex(/^\d*$/).transform(Number).optional(),
  DB_DATABASE: validator.string().optional(),
  DB_USERNAME: validator.string().optional(),
  DB_PASSWORD: validator.string().optional(),

  SEARCH_ENGINE_DRIVER: validator.string().optional(),
  MEILISEARCH_HOST: validator.string().optional(),
  MEILISEARCH_KEY: validator.string().optional(),

  CACHE_DRIVER: validator.enum(['dynamodb', 'memcached', 'redis']).optional(),
  CACHE_PREFIX: validator.string().optional(),
  CACHE_TTL: validator.string().regex(/^\d*$/).transform(Number).optional(),

  AWS_ACCESS_KEY_ID: validator.string().optional(),
  AWS_SECRET_ACCESS_KEY: validator.string().optional(),
  AWS_DEFAULT_REGION: validator.string().optional(),
  DYNAMODB_CACHE_TABLE: validator.string().optional(),
  DYNAMODB_ENDPOINT: validator.string().optional(),

  MEMCACHED_PERSISTENT_ID: validator.string().optional(),
  MEMCACHED_USERNAME: validator.string().optional(),
  MEMCACHED_PASSWORD: validator.string().optional(),
  MEMCACHED_HOST: validator.string().optional(),
  MEMCACHED_PORT: validator.string().regex(/^\d*$/).transform(Number).optional(),

  REDIS_HOST: validator.string().optional(),
  REDIS_PORT: validator.string().regex(/^\d*$/).transform(Number).optional(),

  MAIL_FROM_NAME: validator.string().optional(),
  MAIL_FROM_ADDRESS: validator.string().optional(),

  EMAILJS_HOST: validator.string().optional(),
  EMAILJS_USERNAME: validator.string().optional(),
  EMAILJS_PASSWORD: validator.string().optional(),
  EMAILJS_PORT: validator.string().regex(/^\d*$/).transform(Number).optional(),
  EMAILJS_SECURE: validator.enum(['true', 'false']).transform(Boolean).optional(),

  MAILGUN_API_KEY: validator.string().optional(),
  MAILGUN_DOMAIN: validator.string().optional(),
  MAILGUN_USERNAME: validator.string().optional(),

  MAILJET_API_KEY: validator.string().optional(),
  MAILJET_API_SECRET: validator.string().optional(),

  MANDRILL_API_KEY: validator.string().optional(),

  NETCORE_API_KEY: validator.string().optional(),

  NODEMAILER_HOST: validator.string().optional(),
  NODEMAILER_USERNAME: validator.string().optional(),
  NODEMAILER_PASSWORD: validator.string().optional(),
  NODEMAILER_PORT: validator.string().regex(/^\d*$/).transform(Number).optional(),
  NODEMAILER_SECURE: validator.enum(['true', 'false']).transform(Boolean).optional(),

  POSTMARK_API_TOKEN: validator.string().optional(),
  POSTMARK_API_KEY: validator.string().optional(),

  SENDGRID_API_KEY: validator.string().optional(),
  SENDGRID_SENDER_NAME: validator.string().optional(),

  SES_API_VERSION: validator.string().optional(),
  SES_ACCESS_KEY_ID: validator.string().optional(),
  SES_SECRET_ACCESS_KEY: validator.string().optional(),
  SES_REGION: validator.string().optional(),

  FROM_PHONE_NUMBER: validator.string().optional(),
  TWILIO_ACCOUNT_SID: validator.string().optional(),
  TWILIO_AUTH_TOKEN: validator.string().optional(),

  VONAGE_API_KEY: validator.string().optional(),
  VONAGE_API_SECRET: validator.string().optional(),

  GUPSHUP_USER_ID: validator.string().optional(),
  GUPSHUP_PASSWORD: validator.string().optional(),

  PLIVO_ACCOUNT_ID: validator.string().optional(),
  PLIVO_AUTH_TOKEN: validator.string().optional(),

  SMS77_API_KEY: validator.string().optional(),

  SNS_REGION: validator.string().optional(),
  SNS_ACCESS_KEY_ID: validator.string().optional(),
  SNS_SECRET_ACCESS_KEY: validator.string().optional(),

  TELNYX_API_KEY: validator.string().optional(),
  TELNYX_MESSAGE_PROFILE_ID: validator.string().optional(),

  TERMII_API_KEY: validator.string().optional(),

  SLACK_FROM: validator.string().optional(),
  SLACK_APPLICATION_ID: validator.string().optional(),
  SLACK_CLIENT_ID: validator.string().optional(),
  SLACK_SECRET_KEY: validator.string().optional(),

  MICROSOFT_TEAMS_APPLICATION_ID: validator.string().optional(),
  MICROSOFT_TEAMS_CLIENT_ID: validator.string().optional(),
  MICROSOFT_TEAMS_SECRET: validator.string().optional(),
})

export const frontendEnvSchema = validator.object({
  FRONTEND_APP_ENV: validator.enum(['local', 'development', 'staging', 'production']).optional(),
  FRONTEND_APP_URL: validator.string().optional(),
})

export type BackendEnv = Infer<typeof backendEnvSchema>
export type BackendEnvKeys = keyof BackendEnv

export type FrontendEnv = Infer<typeof frontendEnvSchema>
export type FrontendEnvKeys = keyof FrontendEnv

export type Env = Infer<typeof envSchema>
export type EnvKeys = keyof Env

export function env() {
  const mode = process.env.NODE_ENV ?? 'development'
  const data = loadEnv(mode, projectPath(), envPrefix)
  const v = validator.compile(envSchema)

  return v.validate(data)

  // catch (error: any) {
  //   // if (error instanceof errors.E_VALIDATION_ERROR)
  //   //   console.log(error.messages)
  //   handleError(error)
  //   return { success: false, error }
  // }
}

export function getEnvIssues(env?: any): void {
  const result = env()

  if (!result.success) {
    const message = result.error.message
    log.error(message)
    return
  }

  return result
}

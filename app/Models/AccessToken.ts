import { collect } from '@stacksjs/collections'
import { faker } from '@stacksjs/faker'
import type { Model } from '@stacksjs/types'
import { schema } from '@stacksjs/validation'

export default {
  name: 'AccessToken', // defaults to the sanitized file name
  table: 'access_tokens', // defaults to the lowercase, plural name of the model name (or the name of the model file)
  primaryKey: 'id', // defaults to `id`
  autoIncrement: true, // defaults to true

  hasOne: ['Team'],

  traits: {
    useTimestamps: true, // defaults to true
    useSeeder: {
      // defaults to a count of 10
      count: 10,
    },
  },

  attributes: {
    name: {
      validator: {
        rule: schema.string(),
        message: '`name` must be a string',
      },

      factory: () => faker.lorem.sentence({ min: 3, max: 6 }),
    },

    token: {
      unique: true,
      validator: {
        rule: schema.string().maxLength(512),
        message: '`token` must be a string',
      },

      factory: () => faker.string.uuid(),
    },

    plainTextToken: {
      validator: {
        rule: schema.string().maxLength(512),
        message: '`plainTextToken` must be a string',
      },

      factory: () => faker.string.uuid(),
    },

    abilities: {
      validator: {
        rule: schema.enum(['read', 'write', 'admin', 'read|write', 'read|admin', 'write|admin', 'read|write|admin']),
        message:
          '`abilities` must be string of either `read`, `write`, `admin`, `read|write`, `read|admin`, `write|admin`, or `read|write|admin`',
      },

      factory: () =>
        collect(['read', 'write', 'admin', 'read|write', 'read|admin', 'write|admin', 'read|write|admin']).random(),
    },
  },
} satisfies Model

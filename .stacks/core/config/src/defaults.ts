import type { StacksOptions } from '@stacksjs/types'
import { path as p } from '@stacksjs/path'

// import { userConfig as overrides } from './overrides'

export default {
  analytics: {
    driver: undefined,
  },

  api: {
    prefix: 'api',
    description: 'Stacks API',
    prewarm: true,
    memorySize: 512,
    timeout: 30,
    // version: 'v1',
  },

  app: {
    name: 'Stacks',
    env: 'local',
    url: 'stacks.test',
    debug: true,
    key: '',
    timezone: 'UTC',
    locale: 'en',
    fallbackLocale: 'en',
    cipher: 'AES-256-CBC',
    docMode: false,
  },

  binary: {
    name: 'buddy',
    command: 'buddy',
    description: 'Stacks is a full-stack framework for TypeScript.',
    source: p.appPath('commands'),
  },

  cache: {
    driver: 'redis',
    prefix: 'stx',
    ttl: 3600,

    drivers: {
      redis: {
        connection: 'default',
        host: 'localhost',
        port: 6379,
      },
    },
  },

  cloud: {
    driver: 'aws',

    storage: {},

    firewall: {
      immunity: 0,
      challenge: {
        captcha: {
          duration: 60,
          headerName: 'X-Captcha',
          headerValue: 'true',
        },
      },
      rules: [
        {
          name: 'default',
          priority: 0,
          action: { block: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'default',
          },
          statement: {
            rateBasedStatement: {
              limit: 1000,
              aggregateKeyType: 'IP',
            },
          },
        },
      ],
    },

    cdn: {
      enableLogging: true,
      allowedMethods: 'GET_HEAD',
      cachedMethods: 'GET_HEAD',
      minTtl: 0,
      defaultTtl: 86400,
      maxTtl: 31536000,
      compress: true,
      priceClass: 'PriceClass_All',
      originShieldRegion: 'us-east-1',
      cookieBehavior: 'none',
      allowList: {
        cookies: [],
        headers: [],
        queryStrings: [],
      },
    },

    deploy: {
      docs: true,
      api: true,
      fileSystem: true,
    },
  },

  database: {
    default: 'sqlite',

    name: 'stacks',

    connections: {
      sqlite: {
        database: p.projectStoragePath('framework/database/stacks.sqlite'),
        prefix: '',
      },
    },
  },

  dns: {
    driver: 'aws',
    a: [],
    aaaa: [],
    cname: [],
    mx: [],
    txt: [],
  },

  docs: {
    lang: 'en-US',
    title: 'Stacks',
    description: 'Rapid application, cloud & library framework.',
    lastUpdated: true,

    themeConfig: {
      editLink: {
        pattern: 'https://github.com/stacksjs/stacks/edit/main/docs/docs/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2023-present Stacks',
      },

      // algolia: services.algolia,

      // carbonAds: {
      //   code: '',
      //   placement: '',
      // },
    },
  },

  email: {
    from: {
      name: 'Stacks',
      address: 'no-reply@stacksjs.org',
    },

    mailboxes: {},
  },

  git: {
    hooks: {
      'pre-commit': 'lint-staged',
    },

    scopes: [
      '',
      'ci',
      'deps',
      'dx',
      'release',
      'docs',
      'test',
      'core',
      'actions',
      'arrays',
      'auth',
      'build',
      'cache',
      'cli',
      'cloud',
      'collections',
      'config',
      'database',
      'datetime',
      'docs',
      'errors',
      'git',
      'lint',
      'x-ray',
      'modules',
      'notifications',
      'objects',
      'path',
      'realtime',
      'router',
      'buddy',
      'security',
      'server',
      'storage',
      'strings',
      'tests',
      'types',
      'ui',
      'utils',
    ],

    messages: {
      type: 'Select the type of change that you’re committing:',
      scope: 'Select the SCOPE of this change (optional):',
      customScope: 'Select the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: 'Select the ISSUES type of the change list by this change (optional):',
      customFooterPrefixes: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },

    types: [
      { value: 'feat', name: 'feat:     ✨  A new feature', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix:      🐛  A bug fix', emoji: ':bug:' },
      { value: 'docs', name: 'docs:     📝  Documentation only changes', emoji: ':memo:' },
      { value: 'style', name: 'style:    💄  Changes that do not affect the meaning of the code', emoji: ':lipstick:' },
      { value: 'refactor', name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature', emoji: ':recycle:' },
      { value: 'perf', name: 'perf:     ⚡️  A code change that improves performance', emoji: ':zap:' },
      { value: 'test', name: 'test:     ✅  Adding missing tests or adjusting existing tests', emoji: ':white_check_mark:' },
      { value: 'build', name: 'build:    📦️  Changes that affect the build system or external dependencies', emoji: ':package:' },
      { value: 'ci', name: 'ci:       🎡  Changes to our CI configuration files and scripts', emoji: ':ferris_wheel:' },
      { value: 'chore', name: 'chore:    🔨  Other changes that don’t modify src or test files', emoji: ':hammer:' },
      { value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: ':rewind:' },
    ],
  },

  hashing: {
    driver: 'argon2',

    bcrypt: {
      rounds: 10,
      cost: 4, // number between 4-31
    },

    argon2: {
      memory: 65536, // memory usage in kibibytes
      threads: 1,
      time: 1, // the number of iterations
    },
  },

  library: {
    name: 'hello-world',
    owner: '@stacksjs', // you may or may not add the @ prefix here (it is added automatically)
    repository: 'stacksjs/stacks',
    license: 'MIT',
    author: 'Chris Breuer',
    contributors: ['Chris Breuer <chris@stacksjs.org>'],
    defaultLanguage: 'en',

    vueComponents: {
      name: 'hello-world-vue',
      description: 'Your Vue component library description',
      keywords: ['component', 'library', 'vue', 'vite', 'typescript', 'javascript'],
      tags: [{
        name: ['HelloWorld', 'AppHelloWorld'],
        description: 'The Hello World custom element, built via this framework.',
        attributes: [{
          name: 'greeting',
          description: 'The greeting.',
        }],
      }],
    },

    webComponents: {
      name: 'hello-world-elements',
      description: 'Your framework agnostic web component library description.',
      keywords: ['custom-elements', 'web-components', 'library', 'framework-agnostic', 'typescript', 'javascript'],
      tags: [{
        name: ['HelloWorld', 'AppHelloWorld'],
        description: 'The Hello World custom element, built via this framework.',
        attributes: [{
          name: 'greeting',
          description: 'The greeting.',
        }],
      }],
    },

    functions: {
      name: 'hello-world-fx',
      description: 'Your function library description.',
      keywords: ['functions', 'composables', 'library', 'typescript', 'javascript'],
      shouldGenerateSourcemap: false,
      functions: [
        'counter',
        'dark',
      ],
    },
  },

  notification: {
    default: 'email',
  },

  payment: {
    driver: 'stripe',
  },

  queue: {
    default: 'sync',

    connections: {
      sync: {
        driver: 'sync',
      },

      database: {
        driver: 'database',
        table: 'jobs',
        queue: 'default',
        retry_after: 90,
      },

      redis: {
        driver: 'redis',
        connection: 'default',
        queue: 'default',
        retry_after: 90,
      },

      sqs: {
        driver: 'sqs',
        key: '',
        secret: '',
        prefix: '',
        suffix: '',
        queue: 'default',
        region: 'us-east-1',
      },
    },
  },

  searchEngine: {
    driver: 'meilisearch',
  },

  security: {
    app: {
      firewall: {
        immunity: 300, // CAPTCHA immunity time 300 seconds
        challenge: {
          captcha: {
            duration: 300,
            headerName: 'x-captcha',
            headerValue: 'true',
          },
        },

        rules: [
          // rule to limit requests to 1000 per 5 minutes
          {
            action: { block: {} },
            name: 'RateLimitRule',
            priority: 0,
            statement: {
              rateBasedStatement: {
                aggregateKeyType: 'IP',
                limit: 1000,
              },
            },
            visibilityConfig: {
              sampledRequestsEnabled: true,
              cloudWatchMetricsEnabled: true,
              metricName: 'rateLimitRuleMetric',
            },
          },

          // use managed rule AWSManagedRulesAmazonIpReputationList
          {
            name: 'AWSManagedRulesAmazonIpReputationList',
            priority: 1,
            // use rule action
            action: { allow: {} },
            visibilityConfig: {
              sampledRequestsEnabled: true,
              cloudWatchMetricsEnabled: true,
              metricName: 'AWSManagedRulesAmazonIpReputationList',
            },
            statement: {
              managedRuleGroupStatement: {
                vendorName: 'AWS',
                name: 'AWSManagedRulesAmazonIpReputationList',
              },
            },
          },

          // use managed rule AWSManagedRulesKnownBadInputsRuleSet
          {
            name: 'AWSManagedRulesKnownBadInputsRuleSet',
            priority: 2,
            // use rule action
            action: { allow: {} },
            visibilityConfig: {
              sampledRequestsEnabled: true,
              cloudWatchMetricsEnabled: true,
              metricName: 'AWSManagedRulesKnownBadInputsRuleSet',
            },
            statement: {
              managedRuleGroupStatement: {
                vendorName: 'AWS',
                name: 'AWSManagedRulesKnownBadInputsRuleSet',
              },
            },
          },

          // use managed rule Account takeover prevention
          // {
          //   name: 'AWSManagedRulesAccountTakeoverProtectionRuleSet',
          //   priority: 4,
          //   // use rule action
          //   action: { allow: {} },
          //   visibilityConfig: {
          //     sampledRequestsEnabled: true,
          //     cloudWatchMetricsEnabled: true,
          //     metricName: 'AWSManagedRulesAccountTakeoverProtectionRuleSet',
          //   },
          //   statement: {
          //     managedRuleGroupStatement: {
          //       vendorName: 'AWS',
          //       name: 'AWSManagedRulesAccountTakeoverProtectionRuleSet',
          //     },
          //   },
          // },

          // use managed rule Account creation fraud prevention
          // {
          //   name: 'AWSManagedRulesAdminProtectionRuleSet',
          //   priority: 5,
          //   // use rule action
          //   action: { allow: {} },
          //   visibilityConfig: {
          //     sampledRequestsEnabled: true,
          //     cloudWatchMetricsEnabled: true,
          //     metricName: 'AWSManagedRulesAdminProtectionRuleSet',
          //   },
          //   statement: {
          //     managedRuleGroupStatement: {
          //       vendorName: 'AWS',
          //       name: 'AWSManagedRulesAdminProtectionRuleSet',
          //     },
          //   },
          // },
        ],
      },
    },
  },

  services: {
    aws: {
      accountId: '',
      appId: '',
      apiKey: '',
      region: 'us-east-1',
    },

    algolia: {
      appId: '',
      apiKey: '',
    },

    meilisearch: {
      appId: '',
      apiKey: '',
    },

    stripe: {
      appId: '',
      apiKey: '',
    },

    planetscale: {
      appId: '',
      apiKey: '',
    },

    supabase: {
      appId: '',
      apiKey: '',
    },
  },

  storage: {
    driver: 's3',
  },

  team: {},

  ui: {
    shortcuts: [
      ['btn', 'inline-flex items-center px-4 py-2 ml-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'],
    ],
    safelist: 'prose prose-sm m-auto text-left',
    trigger: ':stx:',
    classPrefix: 'stx-',
    reset: 'tailwind',

    icons: ['heroicons'],

    fonts: {
      email: {
        title: 'Mona',
        text: 'Hubot',
      },

      desktop: {
        title: 'Mona',
        text: 'Hubot',
      },

      mobile: {
        title: 'Mona',
        text: 'Hubot',
      },

      web: {
        title: 'Mona',
        text: 'Hubot',
      },
    },
  },
} satisfies StacksOptions

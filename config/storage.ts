import { defineStorageConfig } from '../.stacks/core/config/src/helpers'

/**
 * **Storage Options**
 *
 * This configuration defines all of your storage options. Because Stacks is fully-typed,
 * you may hover any of the options below and the definitions will be provided. In case
 * you have any questions, feel free to reach out via Discord or GitHub Discussions.
 */
export default defineStorageConfig({
  driver: 's3',
})

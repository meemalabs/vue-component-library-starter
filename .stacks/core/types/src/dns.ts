export interface DnsOptions {
  /**
   * **DNS Options**
   *
   * This configuration defines all of your DNS options. Because Stacks is fully-typed,
   * you may hover any of the options below and the definitions will be provided. In case
   * you have any questions, feel free to reach out via Discord or GitHub Discussions.
   *
   * @default {}
   * @see https://stacksjs.dev/docs/dns
   */
  a?: []
  aaaa?: []
  cname?: []
  mx?: []
  ns?: []
  txt?: []
}

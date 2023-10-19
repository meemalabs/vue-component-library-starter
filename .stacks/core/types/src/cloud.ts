export type CountryCode =
  | 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AQ' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ'
  | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BV' | 'BW' | 'BY' | 'BZ'
  | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ'
  | 'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ'
  | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET'
  | 'FI' | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR'
  | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GS' | 'GT' | 'GU' | 'GW' | 'GY'
  | 'HK' | 'HM' | 'HN' | 'HR' | 'HT' | 'HU'
  | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT'
  | 'JE' | 'JM' | 'JO' | 'JP'
  | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' | 'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ'
  | 'LA' | 'LB' | 'LC' | 'LI' | 'LK' | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY'
  | 'MA' | 'MC' | 'MD' | 'ME' | 'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX' | 'MY' | 'MZ'
  | 'NA' | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU' | 'NZ'
  | 'OM'
  | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PN' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY'
  | 'QA'
  | 'RE' | 'RO' | 'RS' | 'RU' | 'RW'
  | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI' | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' | 'SX' | 'SY' | 'SZ'
  | 'TC' | 'TD' | 'TF' | 'TG' | 'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW' | 'TZ'
  | 'UA' | 'UG' | 'UM' | 'US' | 'UY' | 'UZ'
  | 'VA' | 'VC' | 'VE' | 'VG' | 'VI' | 'VN' | 'VU'
  | 'WF' | 'WS'
  | 'YE' | 'YT'
  | 'ZA' | 'ZM' | 'ZW'

export interface CloudOptions {
  driver: 'aws'

  // eslint-disable-next-line ts/ban-types
  storage: {}

  firewall: {
    enabled: boolean
    block: {
      countries?: CountryCode[]
      ipAddresses?: string[]
      userAgent?: string[]
      httpReferer?: string[]
      httpHost?: string[]
    }
    immunity: number
    challenge: {
      captcha: {
        duration: number
        headerName: string
        headerValue: string
      }
    }
    rules: {
      name: string
      priority: number
      // eslint-disable-next-line ts/ban-types
      action: { block?: {}; allow?: {} }
      visibilityConfig: {
        sampledRequestsEnabled: boolean
        cloudWatchMetricsEnabled: boolean
        metricName: string
      }
      statement: {
        rateBasedStatement?: {
          limit: number
          aggregateKeyType: 'IP'
        }
        managedRuleGroupStatement?: {
          vendorName: 'AWS'
          name: string
        }
      }
    }[]
  }

  cdn: {
    enableLogging: boolean
    allowedMethods: 'GET_HEAD' | 'GET_HEAD_OPTIONS' | 'ALL'
    cachedMethods: 'GET_HEAD' | 'GET_HEAD_OPTIONS'
    minTtl: number
    defaultTtl: number
    maxTtl: number
    compress: boolean
    priceClass: 'PriceClass_100' | 'PriceClass_200' | 'PriceClass_All'
    originShieldRegion: string
    cookieBehavior: 'none' | 'allowList' | 'all'
    allowList: {
      cookies: string[]
      headers: string[]
      queryStrings: string[]
    }
  }

  deploy: {
    docs: boolean
    api: boolean
    fileSystem: boolean
  }
}

export type CloudConfig = Partial<CloudOptions>

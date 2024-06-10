/** server-only-file */
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import getMetaData from 'metadata-scraper'
import { log, safeUrl } from '@fiction/core'
import type { FictionCache } from '@fiction/core/plugin-cache'
import type { ReferralParams } from '../../tables'
import { getCleanUrl } from './utils'

type ReferrerDictionary = Record<string, ReferrerItem>

interface ReferrerItem {
  name: string
  medium: keyof ReferrerSource
  params?: string[]
}
interface ReferrerSourceItem {
  name: string
  domains: string[]
  parameters?: string[]
}
type ReferrerSourceRecord = Record<
  string, // domain
  ReferrerSourceItem
>
interface ReferrerSource {
  unknown: ReferrerSourceRecord
  social: ReferrerSourceRecord
  search: ReferrerSourceRecord
  paid: ReferrerSourceRecord
  email: ReferrerSourceRecord
  local: ReferrerSourceRecord
  internal: ReferrerSourceRecord
}
export interface EnrichedReferrer {
  medium: keyof ReferrerSource | ''
  referrerNiceName: string
  searchParameter: string
  searchTerm: string
  canonical: string
  title: string
  description: string
  image: string
}

interface UnfurlResult {
  title: string
  description: string
  image: string
  canonical: string
}

export class ReferrerUtility {
  dictionary: ReferrerDictionary
  fictionCache?: FictionCache
  constructor(settings: { fictionCache?: FictionCache } = {}) {
    this.fictionCache = settings.fictionCache
    const dirname = new URL('.', import.meta.url).pathname
    const dataFile = fs.readFileSync(path.join(dirname, '/referrer-list.yml'))
    const data = dataFile.toString()
    const referrerList = yaml.load(data) as ReferrerSource

    this.dictionary = this.loadReferrerDictionary(referrerList)
  }

  getRandomReferrerDomain(): string {
    const keys = Object.keys(this.dictionary)

    const domain = keys[Math.floor(Math.random() * keys.length)]

    return domain
  }

  private loadReferrerDictionary(source: ReferrerSource): ReferrerDictionary {
    const dictionary: ReferrerDictionary = {}

    for (const key in source) {
      const medium = key as keyof ReferrerSource
      const configList = source[medium]

      for (const referrerName in configList) {
        const config = configList[referrerName]
        let params: string[]

        if (config.parameters) {
          params = config.parameters.map((p: string) => {
            return p.toLowerCase()
          })
        }
        config.domains.forEach((domain: string) => {
          dictionary[domain] = {
            name: referrerName,
            medium,
          }
          if (params)
            dictionary[domain].params = params
        })
      }
    }

    return dictionary
  }

  private lookupReferrer(
    referringHost: string,
    referringPath = '',
  ): ReferrerItem | undefined {
    let referrer: ReferrerItem | undefined

    const domainKey = referringHost + referringPath

    // try for straight match
    referrer = this.dictionary[domainKey]

    // try match with first part of path
    if (!referrer && referringPath) {
      const path_parts = referringPath.split('/')
      if (path_parts.length > 1) {
        const key = `${referringHost}/${path_parts[1]}`
        referrer = this.dictionary[key] || undefined
      }
    }

    // try remove sub domain
    if (!referrer) {
      const idx = referringHost.indexOf('.')
      if (idx === -1)
        return undefined

      const slicedHost = referringHost.slice(idx + 1)
      return this.lookupReferrer(slicedHost, referringPath)
    }

    return referrer
  }

  private async unfurl(opts: { url: string }): Promise<Partial<UnfurlResult>> {
    const { url } = opts

    const out = { title: '', description: '', image: '', canonical: '' }

    if (url.includes('localhost'))
      return out

    const cache = this.fictionCache?.getCache()
    const cacheKey = this.fictionCache?.redisKey('unfurl', url)
    let cached: string = ''
    if (cache && cacheKey)
      cached = (await cache?.get(cacheKey)) || ''

    try {
      if (cached)
        return JSON.parse(cached) as UnfurlResult

      const data = await getMetaData(url)

      out.title = data.title || ''
      out.description = data.description || ''
      out.image = data.image || ''
      out.canonical = data.url || ''

      if (cache && cacheKey)
        await cache.set(cacheKey, JSON.stringify(out), 'EX', 60 * 60 * 12)
    }
    catch (error: unknown) {
      log.info('unfurl', `unfurl error ${url}`, { error })
    }

    return out
  }

  public async getReferralParameters(
    originalReferrer: string,
    currentUrl: string,
  ): Promise<Partial<ReferralParams>> {
    const parsedUrl = new URL(currentUrl || `x://x.x.x`)
    const urlParams = new URLSearchParams(parsedUrl.search)

    const r = urlParams.get('referrer')
    const ref = r && r.includes('.') ? `https://${r}` : r

    const referrer = ref || originalReferrer

    const enriched = await this.enrichReferrer(referrer, currentUrl)
    const {
      medium,
      searchTerm,
      referrerNiceName,
      title,
      description,
      image,
      canonical,
    } = enriched ?? {}

    const cleanUrl = getCleanUrl(originalReferrer)

    const sourceParam = urlParams.get('utm_source') || urlParams.get('source')

    const referralSource
      = sourceParam || referrerNiceName || cleanUrl || undefined

    return {
      referrer,
      referralSource,
      referralCampaign: urlParams.get('utm_campaign') || medium || undefined,
      referralMedium: urlParams.get('utm_medium') || medium || undefined,
      referralTerm: urlParams.get('utm_term') || searchTerm || undefined,
      referralContent: urlParams.get('utm_content') || undefined,
      referralTitle: title || undefined,
      referralDescription: description || undefined,
      referralImage: image || undefined,
      referralCanonicalUrl: canonical || undefined,
    }
  }

  public async enrichReferrer(
    referringUrl?: string,
    currentUrl?: string,
  ): Promise<Partial<EnrichedReferrer> | undefined> {
    const out: Partial<EnrichedReferrer> = {
      medium: '',
      searchParameter: '',
      searchTerm: '',
      referrerNiceName: '',
    }

    if (!referringUrl)
      return out

    try {
      const _referralUrl = safeUrl(referringUrl)

      if (!_referralUrl)
        return out

      const referralHost = _referralUrl.hostname

      // is the referrer an unknown file protocol?
      // tilde converts -1 to false, positive true
      const knownProtocol = Boolean(
        ~['http:', 'https:'].indexOf(_referralUrl.protocol),
      )

      if (!knownProtocol)
        return out

      const { title, description, image, canonical } = await this.unfurl({
        url: referringUrl,
      })
      out.title = title?.slice(0, 255)
      out.description = description?.slice(0, 255)
      out.image = image?.slice(0, 255)
      out.canonical = canonical

      // is referrer coming from localhost?
      if (referringUrl.includes('localhost')) {
        out.medium = 'local'
        out.referrerNiceName = 'Localhost'
        return out
      }

      // Is the referrer from same site?
      if (currentUrl) {
        const _currentURL = new URL(currentUrl)
        const currentHost = _currentURL.hostname

        if (currentHost === referralHost)
          out.medium = 'internal'
      }

      let referrerData = this.lookupReferrer(
        referralHost,
        _referralUrl.pathname,
      )

      if (!referrerData)
        referrerData = this.lookupReferrer(referralHost)

      // couldn't find referrer
      if (!referrerData)
        return out

      out.referrerNiceName = referrerData.name
      out.medium = referrerData.medium

      if (out.medium === 'search' && referrerData.params) {
        const pqs = new URLSearchParams(_referralUrl.search.replace('?', ''))
        for (const param in pqs) {
          const [key, value] = param

          if (value && referrerData.params.includes(key.toLowerCase())) {
            out.searchParameter = key
            out.searchTerm = Array.isArray(value) ? value.join(' ') : value
          }
        }
      }
    }
    catch (error) {
      log.info('enrichReferrer', 'enrichReferrer error', { error })
    }
    return out
  }
}

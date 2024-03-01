import { getDeviceType, slugify } from '@factor/api'
import { isReturningSession } from '@kaption/client/config'
import type { TargetingFilter } from '../types'
import { getGeo } from './tagGeo'

function getValues(v?: string): (string | boolean)[] {
  if (!v || v === '')
    return []

  const r = v.split(',').map((_) => {
    const _t = slugify(_)
    if (_t && ['on', 'true', 'yes', '1'].includes(_t))
      return true
    else if (_t && ['off', 'false', 'no', '0'].includes(_t))
      return false
    else
      return _t
  }) as (string | boolean)[]

  return r
}

function referrerRule(type: 'referrer' | 'referralCampaign' | 'referralMedium' | 'referralSource', op: '=' | '!=', values: string[]): { pass: boolean, reason: string } {
  const ref = document.referrer
  if (!ref || values.length === 0)
    return { pass: true, reason: '' }

  const url = new URL(ref)

  let hasValue = true
  if (type === 'referrer') {
    hasValue = values.some(v => ref.includes(v))
  }
  else {
    let vars: string[] = []

    if (type === 'referralCampaign')
      vars = ['utm_campaign', 'campaign']
    else if (type === 'referralMedium')
      vars = ['utm_medium', 'medium']
    else if (type === 'referralSource')
      vars = ['utm_source', 'source', 'ref']

    const paramValues = new Set(
      vars.map(_ => slugify(url.searchParams.get(type) ?? '')),
    )

    hasValue = values.some(v => paramValues.has(v))
  }

  return {
    pass: !!((op === '=' && hasValue) || (op === '!=' && !hasValue)),
    reason: `${type} ${op} ${values.join(',')} from ${ref}`,
  }
}

function sessionRule(type: TargetingFilter['field'], op: '=' | '!=', values: (string | boolean)[]): { pass: boolean, reason: string } {
  if (values.length === 0)
    return { pass: true, reason: '' }

  let hasValue = true

  if (type === 'isReturning') {
    const returning = isReturningSession()
    hasValue = returning === values[0]
  }

  return {
    pass: !!((op === '=' && hasValue) || (op === '!=' && !hasValue)),
    reason: `${type} ${op} ${values.join(',')}`,
  }
}

async function technologyRule(type: 'browser' | 'os', op: '=' | '!=', values: string[]): Promise<{ pass: boolean, reason: string }> {
  if (values.length === 0)
    return { pass: true, reason: '' }

  const { default: UAParser } = await import('ua-parser-js')

  const parser = new UAParser()
  let hasValue: boolean

  if (type === 'browser') {
    const browser = slugify(parser.getBrowser().name ?? '')

    hasValue = values.some(v => browser?.includes(v))
  }
  else {
    const os = slugify(parser.getOS().name ?? '')
    hasValue = values.some(v => os?.includes(v))
  }

  return {
    pass: !!((op === '=' && hasValue) || (op === '!=' && !hasValue)),
    reason: `${type} ${op} ${values.join(',')}`,
  }
}

function deviceRule(type: 'deviceType', op: '=' | '!=', values: string[]): { pass: boolean, reason: string } {
  if (values.length === 0)
    return { pass: true, reason: '' }

  const deviceType = getDeviceType(window.innerWidth)

  const hasValue = values.some(v => deviceType.includes(v))

  return {
    pass: !!((op === '=' && hasValue) || (op === '!=' && !hasValue)),
    reason: `${type} ${op} ${values.join(',')}`,
  }
}

async function geographyRule(type: 'cityName' | 'countryCode', op: '=' | '!=', values: string[]): Promise<{ pass: boolean, reason: string }> {
  if (values.length === 0)
    return { pass: true, reason: '' }

  const geo = await getGeo()

  let hasValue: boolean

  if (type === 'cityName') {
    const cityName = slugify(geo?.cityName ?? '')

    hasValue = values.some(v => cityName?.includes(v))
  }
  else {
    const countryCode = slugify(geo?.countryCode ?? '')
    hasValue = values.some(v => countryCode?.includes(v))
  }

  return {
    pass: !!((op === '=' && hasValue) || (op === '!=' && !hasValue)),
    reason: `${type} ${op} ${values.join(',')}`,
  }
}
/**
 * Takes a set of targeting rules and returns true or false
 */
export async function passesTargetingRules(rules: TargetingFilter[]): Promise<{ pass: boolean, reason: string }> {
  if (!rules || rules.length === 0)
    return { pass: true, reason: '' }

  const results = await Promise.all(
    rules.map(async (r) => {
      const op = r.operator
      if (!op || !r.field)
        return { pass: true, reason: '' }
      const values = getValues(r.filter)
      if (r.category === 'referrer') {
        return referrerRule(r.field, op, values as string[])
      }
      else if (r.category === 'technology') {
        if (r.field === 'deviceType')
          return deviceRule(r.field, op, values as string[])
        else
          return await technologyRule(r.field, op, values as string[])
      }
      else if (r.category === 'session') {
        return sessionRule(r.field, op, values)
      }
      else if (r.category === 'geography') {
        return await geographyRule(r.field, op, values as string[])
      }
      else { return { pass: true, reason: '' } }
    }),
  )

  return {
    pass: results.every(_ => _.pass),
    reason: results
      .filter(_ => !_.pass)
      .map(_ => _.reason)
      .join(', '),
  }
}

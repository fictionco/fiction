import { describe, expect, it } from 'vitest'
import { camelKeys, groupBy, isJson, stringify } from '../utils'

describe('utils', () => {
  it('isJson', async () => {
    const invalid = isJson('not valid json')
    const valid = isJson(`{"valid": "yes"}`)
    expect(invalid).toBeFalsy()
    expect(valid).toBeTruthy()
  })

  it('groupBy', async () => {
    const data = [
      { animal: 'ape', age: 10 },
      { animal: 'ape', age: 12 },
      { animal: 'giraffe', age: 12 },
      { animal: 'giraffe', age: 3 },
    ]
    const result = groupBy(data, 'animal')
    expect(result).toMatchInlineSnapshot(`
      {
        "ape": [
          {
            "age": 10,
            "animal": "ape",
          },
          {
            "age": 12,
            "animal": "ape",
          },
        ],
        "giraffe": [
          {
            "age": 12,
            "animal": "giraffe",
          },
          {
            "age": 3,
            "animal": "giraffe",
          },
        ],
      }
    `)
  })

  it('camelKeys', () => {
    const o = {
      status: 'active',
      ok: true,
      app_id: '11111',
      authed_user: { id: '33333' },
      scope: 'incoming-webhook,commands,chat:write',
      token_type: 'bot',
      access_token: '123123',
      bot_user_id: 'U01CVPCBKT6',
      team: { id: 'T016E9TAQA3', name: 'Kaption' },
      enterprise: null,
      is_enterprise_install: false,
      incoming_webhook: {
        channel: 'notify',
        channel_id: 'GgGgGgGgGg',
      },
    }

    const r = camelKeys(o)

    expect(r).toMatchInlineSnapshot(`
      {
        "accessToken": "123123",
        "appId": "11111",
        "authedUser": {
          "id": "33333",
        },
        "botUserId": "U01CVPCBKT6",
        "enterprise": null,
        "incomingWebhook": {
          "channel": "notify",
          "channelId": "GgGgGgGgGg",
        },
        "isEnterpriseInstall": false,
        "ok": true,
        "scope": "incoming-webhook,commands,chat:write",
        "status": "active",
        "team": {
          "id": "T016E9TAQA3",
          "name": "Kaption",
        },
        "tokenType": "bot",
      }
    `)
  })
})

describe('stringify', () => {
  it('should handle circular structures', () => {
    const circularObj: any = {}
    circularObj.self = circularObj
    expect(stringify(circularObj)).toBe('{}') // Adjust expected result based on your implementation
  })

  it('should handle arrays', () => {
    const array = [1, 'string', null]
    expect(stringify(array)).toBe('[\n  1,\n  "string",\n  null\n]')
  })

  it('should handle strings', () => {
    const str = 'Hello, world!'
    expect(stringify(str)).toBe('"Hello, world!"')
  })

  it('should handle numbers', () => {
    const num = 123
    expect(stringify(num)).toBe('123')
  })

  it('should handle null', () => {
    expect(stringify(null)).toBe('null')
  })

  it('should handle undefined', () => {
    expect(stringify(undefined)).toBeUndefined()
  })

  it('should handle objects', () => {
    const obj = { a: 1, b: 'test', c: null }
    expect(stringify(obj)).toBe('{\n  "a": 1,\n  "b": "test",\n  "c": null\n}')
  })

  it('should handle booleans', () => {
    expect(stringify(true)).toBe('true')
    expect(stringify(false)).toBe('false')
  })

  // Add more tests for edge cases and other data types as needed
})

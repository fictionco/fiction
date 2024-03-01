/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import { beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { EventTag } from '../tag'
import type { CustomTrackEvent } from '../types'

let dataTestUtils: KaptionTestUtils | undefined
let tag: EventTag

describe('event tag', () => {
  beforeAll(async () => {
    dataTestUtils = await createKaptionTestUtils({ initialize: true })

    if (!dataTestUtils.initialized)
      throw new Error('no initialized')

    tag = new EventTag({
      project: dataTestUtils.initialized.project,
      beaconUrl: dataTestUtils.kaptionBeacon.beaconUrl.value,
    })
  })

  it('triggers correctly on url/path', async () => {
    expect(tag.client.beaconUrl).toContain('http://localhost')

    const customEvents = [
      {
        eventId: 'pathname',
        event: 'testPathname',
        pathMatch: '/test',
      },
      {
        eventId: 'url',
        event: 'testUrl',
        pathMatch: 'https://www.test.com/test, /example',
      },
      {
        eventId: 'url2',
        event: 'testUrl2',
        pathMatch: 'https://www.test.com/example, ?s=456',
      },
      {
        eventId: 'search',
        event: 'testSearch',
        pathMatch: '?s=123, ?s=456',
      },
    ] as CustomTrackEvent[]

    const trackEvents = tag.handleUrlEvents({
      location: new URL('https://www.test.com/test'),
      customEvents,
    })

    expect(trackEvents.length).toBe(2)

    expect(trackEvents).toMatchInlineSnapshot(`
      [
        {
          "event": "testPathname",
          "properties": {},
        },
        {
          "event": "testUrl",
          "properties": {},
        },
      ]
    `)

    const trackEvents2 = tag.handleUrlEvents({
      location: new URL('https://www.whatever.com/whatever?s=123'),
      customEvents,
    })

    expect(trackEvents2).toMatchInlineSnapshot(`
      [
        {
          "event": "testSearch",
          "properties": {},
        },
      ]
    `)

    const trackEvents3 = tag.handleUrlEvents({
      location: new URL('https://www.whatever.com/whatever?s=333'),
      customEvents,
    })

    expect(trackEvents3).toMatchInlineSnapshot('[]')

    const trackEvents4 = tag.handleUrlEvents({
      location: new URL('https://www.whatever.com/whatever?s=456'),
      customEvents,
    })

    expect(trackEvents4).toMatchInlineSnapshot(`
      [
        {
          "event": "testUrl2",
          "properties": {},
        },
        {
          "event": "testSearch",
          "properties": {},
        },
      ]
    `)

    const trackEvents5 = tag.handleUrlEvents({
      location: new URL('https://www.test.com/example'),
      customEvents,
    })

    expect(trackEvents5).toMatchInlineSnapshot(`
      [
        {
          "event": "testUrl",
          "properties": {},
        },
        {
          "event": "testUrl2",
          "properties": {},
        },
      ]
    `)
  })

  it('tracks html events', () => {
    const el = document.createElement('div')

    el.classList.add('test-class')
    el.setAttribute('kaption-track', 'identify')
    el.setAttribute('kaption-user-id', 'id123')
    el.setAttribute(
      'kaption-traits',
      JSON.stringify({ email: 'test@test.com' }),
    )
    el.setAttribute('kaption-properties', JSON.stringify({ label: 'hi' }))

    document.body.append(el)

    const customEvents = tag.handleCustomElementEvents({ dom: document })

    expect(customEvents[0].traits?.email).toBe('test@test.com')
    expect(customEvents[0].userId).toBe('id123')
    expect(customEvents[0].event).toBe('identify')

    expect(customEvents).toMatchInlineSnapshot(`
      [
        {
          "event": "identify",
          "properties": {
            "label": "hi",
          },
          "traits": {
            "email": "test@test.com",
          },
          "userId": "id123",
        },
      ]
    `)
  })
})

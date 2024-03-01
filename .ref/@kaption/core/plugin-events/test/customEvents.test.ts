import { beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { snap } from '@factor/api/testUtils'
import { KaptionEvents } from '..'
import type { CustomTrackEvent, ProjectEvents } from '../types'
import type { TagSettings } from '../../plugin-tag/types'

let testUtils:
  | (KaptionTestUtils & { kaptionEvents?: KaptionEvents })
  | undefined

let projectId: string | undefined
let evt: CustomTrackEvent | undefined

describe('custom events', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils()

    const kaptionEvents = new KaptionEvents(testUtils)

    testUtils.kaptionEvents = kaptionEvents

    testUtils.initialized = await testUtils.init({
      kaptionEvents,
    })

    projectId = testUtils.initialized.project.projectId
  })

  it('creates event', async () => {
    if (!testUtils)
      throw new Error('no utils')
    if (!projectId)
      throw new Error('no projectId')
    if (!testUtils.kaptionEvents)
      throw new Error('no testUtils.kaptionEvents')

    const r = await testUtils.kaptionEvents.queries.ManageCustomEvent.serve(
      {
        _action: 'create',
        customEvent: { event: 'test' },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )

    expect(r.status).toBe('success')
    evt = r.data?.[0]
    expect(evt?.event).toBe('test')
    expect(evt?.projectId).toBe(projectId)
    expect(r.message).toBe('event created')
  })

  it('updates event', async () => {
    if (!testUtils)
      throw new Error('no utils')
    if (!projectId)
      throw new Error('no projectId')
    if (!testUtils.kaptionEvents)
      throw new Error('no testUtils.kaptionEvents')

    const r = await testUtils.kaptionEvents.queries.ManageCustomEvent.serve(
      {
        _action: 'update',
        eventId: evt?.eventId,
        customEvent: {
          conversion: 'goal',
          notificationEmail: 'test@kaption.co',
        },
        projectId,
      },
      { bearer: testUtils.initialized?.user },
    )

    expect(r.status).toBe('success')
    evt = r.data?.[0]
    expect(evt?.event).toBe('test')
    expect(evt?.projectId).toBe(projectId)
    expect(r.message).toBe('event updated')
  })

  it('adds events to tag settings', async () => {
    if (!projectId)
      throw new Error('no projectId')
    const r = await testUtils?.kaptionTag.getTagSettings<
      TagSettings & { projectEvents: ProjectEvents }
    >({
      projectId,
    },
    )

    expect(snap(r?.projectEvents)).toMatchInlineSnapshot(`
      [
        {
          "conversion": "goal",
          "createdAt": "[dateTime:]",
          "event": "test",
          "eventId": "[id:**************************]",
          "projectId": "[id:**************************]",
          "updatedAt": "[dateTime:]",
        },
      ]
    `)

    expect(r?.projectEvents.length).toBe(1)
    expect(r?.projectEvents[0]?.notificationEmail).toBeFalsy()
  })
})

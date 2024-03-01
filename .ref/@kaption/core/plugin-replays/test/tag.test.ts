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
import { randomBetween, waitFor } from '@factor/api'
import { IDBKeyRange, indexedDB } from 'fake-indexeddb'
import { ReplayTag } from '../tag'
import { KaptionReplayServer } from '../replayServer'

let dataTestUtils: KaptionTestUtils | undefined
let tag: ReplayTag
describe('replay tag', () => {
  beforeAll(async () => {
    dataTestUtils = await createKaptionTestUtils({ initialize: true })

    if (!dataTestUtils.initialized)
      throw new Error('no initialized')

    window.indexedDB = indexedDB
    window.IDBKeyRange = IDBKeyRange

    const kaptionReplayServer = new KaptionReplayServer({
      ...dataTestUtils,
      sessionBucket: 'factor-testing',
      replayPort: randomBetween(10_000, 20_000),
    })

    await kaptionReplayServer.createServer()

    const socketUrl = kaptionReplayServer.socketUrl

    tag = new ReplayTag({
      project: dataTestUtils.initialized.project,
      beaconUrl: dataTestUtils.kaptionBeacon.beaconUrl.value,
      replaySocketUrl: socketUrl.value,
      bufferIntervalMs: 50,
      recordingMinimumDuration: 0.5,
      recordingTriggers: ['test'],
    })
  })

  it('handles messages from server', async () => {
    expect(tag.client.beaconUrl).toContain('http://localhost')
    expect(tag.socketUrl).toContain('http://localhost')

    await tag.handleWelcome({
      status: 'success',
      message: 'test',
      data: {
        sessionId: 'test',
      },
    })

    for (let i = 0; i < 6; i++) {
      await waitFor(300)
      document.querySelector('a')?.dispatchEvent(new window.MouseEvent('click'))
    }

    const data = await tag.localData({ _action: 'getAll' })

    expect(data?.sessionId).toBe('test')
    expect(tag?.status.value).toBe('local')
    expect(data?.replayData.length).toMatchInlineSnapshot('7')

    await dataTestUtils?.initialized?.kaptionClient.track('test')

    await waitFor(500)

    expect(document.documentElement.innerHTML).toContain('<head>')
    expect(tag.seenEvents.value).toMatchInlineSnapshot(`
      {
        "test": "test",
      }
    `)
    expect(tag.meetsSaveRequirements()).toMatchInlineSnapshot(`
      {
        "data": {
          "activeDuration": 2,
          "minDuration": 0.5,
          "seenEvents": [
            "test",
          ],
          "triggerEvents": [
            "test",
          ],
        },
        "status": "success",
      }
    `)
    expect(tag.meetsSaveRequirements().status).toBe('success')
  })
})

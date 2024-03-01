import { WriteBuffer } from '@factor/api/buffer'
import type { EventData } from '@kaption/service/fields'
import { saveEventBatch } from './sessionSave'
import { serviceSetting } from './utils'

export const eventBuffer = new WriteBuffer<EventData>({
  flush: saveEventBatch,
  limit: serviceSetting<number>('eventBufferItemLimit'),
  maxSeconds: serviceSetting<number>('eventBufferSeconds'),
})

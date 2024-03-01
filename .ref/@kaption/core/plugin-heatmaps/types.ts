import type { ClickOffsetPosition } from '@factor/api'
import type { EventParams } from '../plugin-beacon'

export type ClickEvent = EventParams & {
  meta: { position: ClickOffsetPosition } | string
}

import type { EventType as REventType, eventWithTime } from 'rrweb/typings/types'
import type { serializedNodeWithId } from 'rrweb-snapshot'

interface Hash { key: string, value: string }

export interface FullSnapShotHash {
  hashes?: Hash[]
  type: REventType.FullSnapshot
  data: {
    node: string | serializedNodeWithId
    initialOffset: {
      top: number
      left: number
    }
  }
}

export type ReplayEvent = eventWithTime & {
  hashes?: Hash[]
}
// | (eventWithTime & {
//     hashes?: Hash[]
//   })
// | FullSnapShotHash

export interface StoredReplay {
  events: ReplayEvent[]
  hashes?: Record<string, string>
}

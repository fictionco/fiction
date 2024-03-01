import type { FullSnapShotHash, ReplayEvent } from '@kaption/engine'
import { IncrementalSource } from 'rrweb'
import type { serializedNodeWithId } from 'rrweb-snapshot/typings/types'
import type { eventWithTime } from 'rrweb/typings/types'
import { EventType as REventType } from 'rrweb/typings/types'
import { NodeType, visitSnapshot } from 'rrweb-snapshot'
import { fastHash } from '@factor/api'

function getHashKey(data: string | Record<string, any>, dataType: 'json' | 'css'): string {
  return `hash-${fastHash(data)}.${dataType}`
}

const __THRESHOLD = 500
function extractCss(node: serializedNodeWithId): {
  node: serializedNodeWithId
  hash?: { key: string, value: string }
} {
  if (
    node.type === NodeType.Element
    && node.tagName === 'link'
    && typeof node.attributes._cssText === 'string'
    && node.attributes._cssText.length > __THRESHOLD
  ) {
    const { _cssText: css } = node.attributes
    const key = getHashKey(css, 'css')
    node.attributes._cssText = key

    return {
      node,
      hash: { key, value: css },
    }
  }
  else if (
    node.type === NodeType.Text
    && node.isStyle
    && node.textContent.length > __THRESHOLD
  ) {
    const text = node.textContent
    const key = getHashKey(node.textContent, 'css')
    node.textContent = key
    return {
      node: {
        id: node.id,
        type: NodeType.Element,
        tagName: 'link',
        attributes: { _cssText: key },
        childNodes: [],
      },
      hash: { key, value: text },
    }
  }
  return { node }
}

export function processRecordingEvent(event: eventWithTime): ReplayEvent {
  const record: ReplayEvent = event

  if (record.type === REventType.FullSnapshot) {
    record.hashes = []
    if (typeof record.data.node !== 'string') {
      visitSnapshot(record.data.node, (n) => {
        const { hash } = extractCss(n)
        if (hash)
          record.hashes?.push({ key: hash.key, value: hash.value })
      })
    }
    const { data } = record as FullSnapShotHash
    const hashKey = getHashKey(data.node, 'json')
    record.hashes.push({
      key: hashKey,
      value: JSON.stringify(record.data.node),
    })
    // record.data.node = hashKey
  }
  else if (
    record.type === REventType.IncrementalSnapshot
    && 'source' in event.data
    && event.data.source === IncrementalSource.Mutation
    && event.data.adds.length > 0
  ) {
    record.hashes = []
    for (const add of event.data.adds) {
      const { node, hash } = extractCss(add.node)
      if (hash) {
        record.hashes?.push({ key: hash.key, value: hash.value })

        add.node = node
      }
    }
  }

  return record
}

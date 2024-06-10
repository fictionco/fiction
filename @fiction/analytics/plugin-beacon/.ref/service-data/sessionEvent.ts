import { objectId, omit } from '@factor/api'
import type { KaptionEvent } from '@kaption/client/types'
import type {
  PassedEventFields,
  SessionConsistent,
  SessionConsistentEnriched,
  SessionFields,
} from '@kaption/service/fields'
import {
  allFieldKeys,
  sessionConsistentKeys,
  sessionKeys,
  sharedKeys,
} from '@kaption/service/fields'
import { standardUrl } from './utils'

/**
 * Extract fields from session added to event
 */
export function fieldsFromSession(session: Partial<SessionFields>, event: KaptionEvent): SessionConsistent & Partial<SessionConsistentEnriched> {
  const takeKeys
    = event.event === 'session'
      ? sessionKeys
      : event.event === 'init'
        ? sharedKeys
        : sessionConsistentKeys

  const fields: Record<string, any> = {}
  takeKeys.forEach((key) => {
    if (session[key])
      fields[key] = session[key]
  })

  return fields as SessionConsistent & Partial<SessionConsistentEnriched>
}
/**
 * Extract column fields from traits/properties objects
 */
function fieldsFromProperties(event: KaptionEvent): Partial<PassedEventFields> {
  const takeKeys = allFieldKeys
  const props = event.properties
  const traits = event.traits
  const fields: Record<string, any> = {}
  takeKeys.forEach((key) => {
    if (props?.[key])
      fields[key] = props[key]

    if (traits?.[key])
      fields[key] = traits[key] as unknown
  })

  if (props)
    fields.properties = omit(props, ...allFieldKeys)
  if (traits)
    fields.traits = omit(traits, ...allFieldKeys)

  return fields
}

export function getEventFields(event: KaptionEvent, session: Partial<SessionFields>): PassedEventFields {
  const standardFields = fieldsFromSession(session, event)
  const propFields = fieldsFromProperties(event)

  const { messageId, anonymousId } = event
  const fields: Partial<PassedEventFields> = {
    source: 'client',
    eventId: objectId(),
    messageId,
    anonymousId,
    ...propFields,
  }

  const url = event.context?.page?.url
  const pathname = standardUrl({ url, part: 'pathname' })
  if (pathname)
    fields.pathname = pathname

  if (event.viewNo)
    fields.viewNo = event.viewNo
  if (event.eventNo)
    fields.eventNo = event.eventNo

  return {
    ...standardFields,
    eventName: event.event ?? '(not set)',
    ...fields,
  }
}

import type { Project } from '@factor/api/plugin-admin'
import type { GenType } from '@kaption/client'
import type { ClientTag } from '../tag-utils'

type AvailableTags = 'analytics' | 'events' | 'replays'
export interface TagSettings {
  project?: Partial<Project> & { projectId: string }

  gen?: GenType
  ip?: string
  onlyTags?: AvailableTags[]
  beaconUrl?: string
  intervalSeconds?: number
  statSeconds?: number
  mode?: 'development' | 'production'
}

export type TagEntryPoint<T extends TagSettings> = (
  tagSettings: T,
) => Promise<ClientTag>

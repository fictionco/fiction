import type { TagSettings } from '@kaption/core/plugin-tag'

declare global {
  interface Window {
    __fictionTag?: TagSettings
    fictionTagIsFake?: boolean // for testing
    fictionTagMockReferrer?: string // for testing
  }
}

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}

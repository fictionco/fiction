import type { TagSettings } from '@kaption/core/plugin-tag'

declare global {
  interface Window {
    __kaption?: TagSettings
    kaptionIsFake?: boolean // for testing
    kaptionMockReferrer?: string // for testing
  }
}

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}

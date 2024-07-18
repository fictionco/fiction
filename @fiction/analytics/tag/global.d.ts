import type { TagSettings } from './types'

declare global {
  interface Window {
    __fiction?: TagSettings
    fictionIsFake?: boolean // for testing
    fictionMockReferrer?: string // for testing
  }
}

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}

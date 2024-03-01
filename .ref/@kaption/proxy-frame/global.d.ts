declare global {
  interface Window {
    __or?: string // original base url
    __px?: string // proxy base url
  }
}

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}

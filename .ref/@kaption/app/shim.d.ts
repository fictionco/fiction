declare interface Window {
  testName: string // for id in testing
  // extend the window
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.md' {
  import type { MarkdownFile } from '@factor/api'

  const src: MarkdownFile
  export = src
}

declare module 'datamaps/dist/datamaps.all'
declare module 'dnsbl'

// declare module "fake-indexeddb" {
//   export default window.indexedDB
// }

// declare module "fake-indexeddb/lib/FDBKeyRange" {
//   export default window.IDBKeyRange
// }

interface ClearbitPerson {
  id: string
  name: { fullName: string, givenName: string, familyName: string }
  email: string
  location: string
  timeZone: string
  geo: { city: string, state: string, stateCode: string, country: string }
  bio: string
  site: string
  avatar: string
  employment: {
    domain?: string
    name?: string
    title?: string
    role: string
    subRole: string
    seniority: string
  }
  facebook: { handle: string }
  github: {
    handle: string
    avatar: string
    company: string
    blog: string
    followers: number
  }
  twitter: {
    handle: string
    bio: string
    followers: number
    site: string
    location: string
    following: number
  }
  linkedin: { handle: string }
  gravatar: { handle: string, avatar: string }
}

declare module 'clearbit' {
  function clearbit(key: string): {
    Person: {
      find: (any) => Promise<Partial<ClearbitPerson>>
    }
  }
  export = clearbit
}

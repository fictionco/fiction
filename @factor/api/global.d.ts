declare module "*.png"
declare module "*.jpg"
declare module "*.json"
declare module "*.svg"
declare module "*.css"
declare module "*.md"
declare module "*package"
declare module "jest"
declare module "std-env"
declare module "gravatar"
declare module "strip-markdown"
declare module "markdown-it-video"
declare module "markdown-it-link-attributes"
declare module "markdown-it-implicit-figures"
declare module "rand-token"
declare module "figures"
declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}

interface Window {
  __INITIAL_STATE__: any
  factorReady: boolean
  factorApp: Record<string, any>
  Prism: any

  _factorLoadingScreen: any
  $BASE_URL: string
  docsearch: any
  factorFrame: any
}

declare namespace NodeJS {
  interface Process {
    noDeprecation: boolean
    maxOldSpaceSize: number
  }
  interface Module {
    hot: {
      accept: () => any
      status: () => any
    }
  }
}

declare module "module-alias" {
  function addAlias(
    alias: string,
    cb: (fromPath: string, request: string, alias: string) => string
  ): void
  function addAlias(alias: string, path: string): void
}

declare namespace jest {
  interface Describe {
    win: any
    posix: any
  }
  interface It {
    win: any
    posix: any
  }
}

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

declare module "std-env"

declare module "gravatar"
declare module "strip-markdown"
declare module "markdown-it-video"
declare module "markdown-it-link-attributes"
declare module "markdown-it-implicit-figures"
declare module "rand-token"
declare module "figures"

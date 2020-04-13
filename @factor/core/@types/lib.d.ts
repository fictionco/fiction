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
declare module "blueimp-load-image"
declare module "tailwindcss"
declare module "@fullhuman/postcss-purgecss"

declare module "gravatar"

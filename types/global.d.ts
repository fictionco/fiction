declare module "*.png"
declare module "*.jpg"
declare module "*.json"
declare module "*.svg"

declare module "*.css"
declare module "*.md"
declare module "*package"
declare module "jest"
declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}

interface Window {
  __INITIAL_STATE__: any;
  factorReady: boolean;
  factorApp: Record<string, any>;
  Prism: any;
}

declare namespace NodeJS {
  interface Process {
    noDeprecation: boolean;
    maxOldSpaceSize: number;
  }
}

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
  _factorLoadingScreen: any;
  $BASE_URL: string;
}

declare namespace NodeJS {
  interface Process {
    noDeprecation: boolean;
    maxOldSpaceSize: number;
  }
  interface Module {
    hot: {
      accept: () => any;
      status: () => any;
    };
  }
}

declare module "module-alias" {
  function addAlias(
    alias: string,
    cb: (fromPath: string, request: string, alias: string) => string
  ): void
  function addAlias(alias: string, path: string): void
}

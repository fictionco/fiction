import fs from "fs"

export interface RendererComponents {
  bundle: string;
  template: string;
  clientManifest: string;
}

declare module "webpack-dev-middleware" {
  interface Options {
    fs?: typeof fs;
  }
}

declare module "fs" {
  export function join(): any
}

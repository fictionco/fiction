export interface RendererComponents {
  bundle: string;
  template: string;
  clientManifest: object;
}

declare module "fs" {
  export function join(): any
}

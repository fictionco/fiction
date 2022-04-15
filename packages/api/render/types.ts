export enum RenderMode {
  SPA = "spa",
  SSR = "ssr",
  HYBRID = "hybrid",
}

export interface RenderOptions {
  mode: "production" | "development"
  renderMode: RenderMode
  debug?: boolean
}

export enum StageId {
  Prod = "prod",
  Pre = "pre",
  Dev = "dev",
  Local = "local",
}

export type PackageBuildOptions = {
  buildName: string
  entryFile?: string
  outputDir?: string
  outputDirDev?: string
  configFile?: string
}

export interface PackageJson {
  name: string
  version: string
  main?: string
  types?: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  private?: boolean
  workspaces: string[]
  publishConfig?: {
    access: "public" | "restricted"
  }
  buildOptions: PackageBuildOptions[]
  cwd?: string // added dynamically for parsing reasons
  [key: string]:
    | undefined
    | boolean
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
}

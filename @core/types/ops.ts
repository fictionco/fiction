export enum StageId {
  Prod = "prod",
  Pre = "pre",
  Dev = "dev",
  Local = "local",
}

export type PackageBuildOptions = {
  entryName?: string
  entryFile?: string
  outputDir?: string
  outputDirDev?: string
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
  publishConfig?: {
    access: "public" | "restricted"
  }
  buildOptions: PackageBuildOptions
  [key: string]:
    | undefined
    | boolean
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
}

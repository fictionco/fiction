export enum StageId {
  Prod = "prod",
  Pre = "pre",
  Dev = "dev",
  Local = "local",
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
  buildOptions: {
    entryName?: string
    entryFile?: string
    outputDir?: string
    outputDirDev?: string
  }
  [key: string]:
    | undefined
    | boolean
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
}

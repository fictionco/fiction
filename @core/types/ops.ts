export enum StageId {
  Prod = "prod",
  Pre = "pre",
  Dev = "dev",
  Local = "local",
}

export interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  private?: boolean
  publishConfig?: {
    access: "public" | "restricted"
  }
  [key: string]:
    | undefined
    | boolean
    | string
    | number
    | Record<string, string>
    | string[]
}

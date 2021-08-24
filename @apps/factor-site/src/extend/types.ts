import { FactorPost } from "@factor/types"

export type FactorExtensionInfo = {
  version: string
  maintainers?: {
    name?: string
    email?: string
  }
  downloads: number
  packageName: string
  extensionType: "plugin" | "theme"
  cdnUrl: string
  license?: string
  homepage?: string
  repositoryUrl?: string
  featured?: true
  files?: { name: string; size: number; hash: string }[]
  icon?: string
  screenshots?: string[]
  themeColor?: string
} & FactorPost

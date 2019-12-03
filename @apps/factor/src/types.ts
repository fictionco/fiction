import { FactorPackageJson } from "@factor/cli/types"

export interface DocsItem {
  group?: string;
  slug: string;
  route?: string;
  name?: string;
  title?: string;
  description?: string;
  file?: () => Promise<{ default: string }>;
  root?: boolean;
}

export interface FactorExtensionListing {
  files: { name: string }[];
  cdnBaseUrl: string;
  pkg: FactorPackageJson;
}

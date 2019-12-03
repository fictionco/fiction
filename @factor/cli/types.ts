export enum ExtendTypes {
  Theme = "theme",
  Plugin = "plugin",
  App = "app"
}

export interface FactorPackageJson {
  name: string;
  version: string;
  description?: string;
  license: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  gitHooks?: Record<string, string>;
  scripts?: Record<string, string>;
  workspaces?: string[];
  factor?: {
    load?: string[] | string | { app: string | string[]; server: string | string[] };
    extend?: string;
    priority?: number;
  };
  repository?: { type?: string; url: string };
  [key: string]: any;
}

export enum LoadTargets {
  Server = "server",
  App = "app"
}

export type LoadTarget = {
  [key in LoadTargets]?: { file: string; _id: string; priority: number }[]
}

export interface FactorExtension {
  cwd: boolean;
  _id: string;
  priority: number;
  extend: string;
  main: string;
  name: string;
  version: string;
  load: LoadTarget;
}

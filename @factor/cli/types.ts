export enum ExtendTypes {
  Theme = "theme",
  Plugin = "plugin",
  App = "app"
}

export interface CommandOptions {
  command?: string;
  filter?: string;
  install?: boolean;
  NODE_ENV?: string;
  analyze?: boolean;
  static?: boolean;
  clean?: boolean;
  inspect?: boolean;
  cwd?: string;
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
    title?: string;
    _id?: string;
    load?: LoadTarget;
    extend?: ExtendTypes;
    priority?: number;
  };
  repository?: { type?: string; url: string };
  [key: string]: any;
}

export enum LoadTargets {
  Server = "server",
  App = "app"
}

export type LoadTarget = string[] | string | NormalizedLoadTarget

export type NormalizedLoadTarget = {
  [key: string]: { file: string; _id?: string; priority?: number }[];
  app: { file: string; _id?: string; priority?: number }[];
  server: { file: string; _id?: string; priority?: number }[];
}

export interface FactorExtension {
  isCwd: boolean;
  _id: string;
  priority: number;
  extend: string;
  main: string;
  name: string;
  version: string;
  load: NormalizedLoadTarget;
}

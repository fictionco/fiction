import "@factor/api"
import "tailwindcss/tailwind.css"
import { FactorAppEntry, MainFile } from "@factor/types"
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions, implicit-dependencies/no-implicit
import * as mainFile from "@src/index.ts"
// eslint-disable-next-line import/no-unresolved, import/extensions, implicit-dependencies/no-implicit
import RootComponent from "@src/App.vue"

import { mountApp, factorApp } from "."

export { RootComponent, mainFile }

export const runApp = (
  params: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  return factorApp({ ...params, RootComponent, mainFile: mainFile as MainFile })
}

mountApp({
  mainFile: mainFile as MainFile,
  id: "#app",
  RootComponent,
}).catch(console.error)

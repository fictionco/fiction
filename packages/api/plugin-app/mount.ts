import "tailwindcss/tailwind.css"
import { FactorAppEntry } from "../config/types"
import { mountApp, factorApp } from "./setupApp"

export const runApp = (
  params: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  return factorApp(params)
}

mountApp({ id: "#app" }).catch(console.error)

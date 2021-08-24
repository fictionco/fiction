import { Component, computed } from "vue"
import {
  setLocal,
  getLocal,
  stored,
  storeItem,
  onBrowserEvent,
} from "@factor/api"
export const getDashboardUrl = (path = "/"): string => {
  return `https://app.darwin.so${path}`
}

/**
 * helper function which infers keys and restricts values to ElementType
 * https://stackoverflow.com/questions/54598322/how-to-make-typescript-infer-the-keys-of-an-object-but-define-type-of-its-value
 */
export const mapTypeHelper = <T>(
  et: { [K in keyof T]: FeatureType },
): { [K in keyof T]: FeatureType } => et

export interface FeatureType {
  icon?: string
  class?: string
  bgClass?: string
  path?: string
  name: string
  tagline: string
  description: string
  screenshot?: any
  thumb?: any
  align?: "left" | "right" | "wide"
  figure?: Component
  aspects?: FeatureType[]
}

export const mapTypeHelperIntegrations = <T>(
  et: { [K in keyof T]: Integrations },
): { [K in keyof T]: Integrations } => et

export interface Integrations {
  logo?: string
  class?: string
  name?: string
  path?: string
}

export const getSocial = <T>(
  et: { [K in keyof T]: Social },
): { [K in keyof T]: Social } => et

export interface Social {
  name?: string
  path?: string
  target?: string
  icon?: string
}

const key = "daSiteTrackInteraction"

const getLocalEngage = (): Record<string, number> => {
  return getLocal<Record<string, number>>({ key }) ?? {}
}
const setEngage = (engage: string): void => {
  const value = getLocalEngage()

  value[engage] = (value[engage] ?? 0) + 1
  storeItem(key, value)
  setLocal({ scope: "session", key, value })
}

export const trackInteractions = (): (() => void) => {
  storeItem(key, getLocalEngage())

  const clearWatchers = [
    onBrowserEvent("load", () => setEngage("load")),
    onBrowserEvent("mousemove", () => setEngage("mousemove")),
    onBrowserEvent("mousedown", () => setEngage("mousedown")),
    onBrowserEvent("touchstart", () => setEngage("touchstart")),
    onBrowserEvent("click", () => setEngage("click")),
    onBrowserEvent("keypress", () => setEngage("keypress")),
    onBrowserEvent("scroll", () => setEngage("scroll")),
  ]

  return (): void => {
    clearWatchers.forEach((clearWatcher) => clearWatcher())
  }
}

export const activeInteractions = computed(() => {
  return stored(key)
})

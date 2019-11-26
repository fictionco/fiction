import Vue from "vue"

export const __events = new Vue()

export function emitEvent(event: string, data?: unknown): void {
  __events.$emit(event, data)
}

export function onEvent(event: string, callback: Function): void {
  __events.$on(event, callback)
}

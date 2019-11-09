import Vue from "vue"

export const __events = new Vue()

export function emitEvent(event, data) {
  __events.$emit(event, data)
}

export function onEvent(event, callback) {
  __events.$on(event, callback)
}

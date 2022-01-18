<template>
  <div class="notifications">
    <div
      class="fixed z-50 inset-0 flex flex-col items-center px-4 py-6 pointer-events-none justify-start"
    >
      <transition-group
        name="notification-top"
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="(toast, i) in topToasts"
          :key="i"
          class="transition-all duration-300 max-w-md w-full bg-white shadow-2xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-10 overflow-hidden mb-4"
          :class="toast.type"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="shrink-0">
                <svg
                  v-if="toast.type == 'success'"
                  class="h-6 w-6 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5 capitalize">
                <p class="font-semibold">
                  {{ toast.message }}
                </p>
                <p v-if="toast.more" class="mt-1 text-sm text-slate-400">
                  {{ toast.more }}
                </p>
              </div>
              <div
                class="ml-4 text-slate-400 hover:text-primary-500"
                @click="removeToast(i)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onEvent } from "@factor/api"
import { computed, onMounted, ref } from "vue"

import { NotificationOptions } from "./types"
interface Notification {
  time: number
  message: string
  more?: string
  type: "error" | "success"
}

// const errors = ref<Notification[]>([])
// const notification = ref<Notification[]>([])
const toasts = ref<Notification[]>([])

const topToasts = computed(() => {
  const [...t] = toasts.value
  return t.reverse()
})

const showToast = (config: NotificationOptions) => {
  const { type, message = "", more = "", duration = 4000 } = config

  const time = Date.now()

  toasts.value.push({ time, message, more, type })

  setTimeout(() => {
    toasts.value.shift()
  }, duration)
}

onMounted(() => {
  onEvent("notifySuccess", (config) => {
    showToast({ ...config, type: "success" })
  })

  onEvent("notifyError", (config) => {
    showToast({ ...config, type: "error" })
  })
})

const removeToast = (ind: number) => {
  toasts.value = toasts.value.filter((t, i) => i != ind)
}
</script>

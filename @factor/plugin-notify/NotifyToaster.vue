<template>
  <div class="notifications">
    <div
      class="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-start px-4 py-6"
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
          class="pointer-events-auto mb-4 w-full max-w-md overflow-hidden rounded-lg bg-white text-sm shadow-lg ring-1 ring-black/5 transition-all duration-300"
          :class="toast.type"
        >
          <div class="p-4">
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
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5 capitalize">
                <div class="font-semibold">
                  {{ toast.message }}
                </div>
                <div v-if="toast.more" class="mt-1 text-sm text-slate-400">
                  {{ toast.more }}
                </div>
              </div>
              <div
                class="ml-4 cursor-pointer text-slate-400 hover:text-primary-500"
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
import { onEvent, vue, Notification } from "@factor/api"

const toasts = vue.ref<Notification[]>([])

const topToasts = vue.computed(() => {
  const [...t] = toasts.value
  return t.reverse()
})

const showToast = (config: Notification): void => {
  const { type, message = "", more = "", duration = 4000 } = config

  const shownAt = Date.now()

  toasts.value.push({ shownAt, message, more, type })

  setTimeout(() => {
    toasts.value.shift()
  }, duration)
}

vue.onMounted(() => {
  onEvent("notify", (config: Notification) => showToast(config))
})

const removeToast = (ind: number): void => {
  toasts.value = toasts.value.filter((t, i) => i != ind)
}
</script>

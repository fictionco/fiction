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
          class="pointer-events-auto mb-4 w-full max-w-md overflow-hidden rounded-lg bg-white text-slate-900 text-sm shadow-lg ring-1 ring-black/10 transition-all duration-300"
          :class="toast.type"
        >
          <div class="p-4">
            <div class="flex">
              <div class="shrink-0">
                <div
                  v-if="toast.type == 'success'"
                  class="i-carbon-checkmark text-2xl text-green-500"
                ></div>

                <div
                  v-else
                  class="i-carbon-warning text-2xl text-red-500"
                ></div>
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
                class="hover:text-primary-500 ml-4 cursor-pointer text-slate-400"
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
import { onEvent, vue, Notification, log, slugify } from "@factor/api"

const props = defineProps({
  dev: { type: Boolean, default: false },
})

const defaultToasts: Notification[] = props.dev
  ? [
      {
        type: "success",
        message: "Success!",
        more: "This is a success message.",
        key: "success",
      },
      {
        type: "error",
        message: "Error!",
        more: "This is an error message.",
        key: "error",
      },
    ]
  : []

const toasts = vue.ref<Notification[]>(defaultToasts)

const topToasts = vue.computed(() => {
  const [...t] = toasts.value
  return t.reverse()
})

const showToast = (config: Notification): void => {
  log.info("notifyPlugin", "notification", { data: config })

  const { type, message = "", more = "", duration = 4000 } = config

  const shownAt = Date.now()

  const key = slugify(message)

  /**
   * Use key to prevent duplicate notifications
   */
  if (!toasts.value.some((t) => t.key == key)) {
    toasts.value.push({
      type,
      message,
      more,
      shownAt,
      duration,
      key,
    })

    setTimeout(() => {
      toasts.value.shift()
    }, duration)
  }
}

vue.onMounted(() => {
  onEvent("notify", (config: Notification) => showToast(config))
})

const removeToast = (ind: number): void => {
  toasts.value = toasts.value.filter((t, i) => i != ind)
}
</script>

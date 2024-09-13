<script lang="ts" setup>
import type { UserNotification } from '@fiction/core'
import { log, toSlug, useService, vue } from '@fiction/core'

const props = defineProps({
  dev: { type: Boolean, default: false },
})

const service = useService()

const defaultToasts: UserNotification[] = props.dev
  ? [
      { type: 'success', message: 'Success!', more: 'This is a success message.', key: 'success' },
      { type: 'error', message: 'Error!', more: 'This is an error message.', key: 'error' },
      { type: 'info', message: 'Info', key: 'info' },
    ]
  : []

const toasts = vue.ref<UserNotification[]>(defaultToasts)

const topToasts = vue.computed(() => {
  const [...t] = toasts.value
  return t.reverse()
})

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function showToast(config: UserNotification): void {
  log.info('notifyPlugin', 'UserNotification', { data: config })

  const { type, message = '', more = '', duration = 3500 } = config

  const shownAt = Date.now()

  const key = toSlug(message)

  /**
   * Use key to prevent duplicate UserNotifications
   */
  if (!toasts.value.some(t => t.key === key)) {
    toasts.value.push({ type, message, more, shownAt, duration, key })

    setTimeout(() => {
      toasts.value.shift()
    }, duration)
  }
}

vue.onMounted(() => {
  service.fictionEnv.events.on('notify', (e) => {
    const notifcation = e.detail
    showToast(notifcation)
  })
})
</script>

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
          class="pointer-events-auto mb-4 w-full max-w-xs overflow-hidden rounded-full bg-black/80 dark:bg-theme-700/90 text-sm text-white dark:text-theme-0 shadow-xl border border-black dark:border-theme-500 transition-all duration-300"
          :class="[toast.type]"
        >
          <div class="py-2 pl-2 pr-4">
            <div class="flex items-center justify-between">
              <div class="ml-4 capitalize">
                <div class="text-sm font-semibold tracking-tight">
                  {{ capitalizeFirstLetter(toast.message) }}
                </div>
                <div v-if="toast.more" class="text-xs opacity-80">
                  {{ toast.more }}
                </div>
              </div>
              <div
                class="shrink-0 flex items-center"
                :class="
                  toast.type === 'success'
                    ? 'text-emerald-500'
                    : toast.type === 'error'
                      ? 'text-rose-500'
                      : 'text-emerald-500'
                "
              >
                <div
                  v-if="toast.type === 'success'"
                  class="i-heroicons-check-20-solid text-2xl"
                />
                <div
                  v-else-if="toast.type === 'info'"
                  class="i-heroicons-information-circle text-2xl"
                />

                <div v-else class="i-heroicons-exclamation-triangle text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

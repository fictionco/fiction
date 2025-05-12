<script lang="ts" setup>
import type { ProgressStep } from '@fiction/core/utils/progress'
import { vue } from '@fiction/core'
import { ProgressTimer } from '@fiction/core/utils/progress'

defineOptions({
  name: 'XProgress',
})

const props = defineProps<{
  steps?: ProgressStep[]
  completionMessage?: string
  totalTime?: number
  autoStart?: boolean
}>()

const emit = defineEmits<{
  (e: 'progress', percent: number, message: string): void
  (e: 'complete'): void
}>()

const percent = vue.ref(0)
const message = vue.ref('')
const status = vue.ref('')
const progressTimer = vue.shallowRef<ProgressTimer | undefined>(undefined)

vue.onMounted(() => {
  progressTimer.value = new ProgressTimer('component-progress', {
    steps: props.steps,
    totalTime: props.totalTime,
    completionMessage: props.completionMessage,
    onProgress: (newPercent, newMessage) => {
      percent.value = newPercent
      message.value = newMessage
      emit('progress', newPercent, newMessage)
    },
    onComplete: () => {
      percent.value = 100
      message.value = props.completionMessage || 'Complete'
      emit('complete')
    },
    onError: (errorMessage) => {
      status.value = errorMessage || 'An error occurred'
    },
  })
  if (props.autoStart) {
    progressTimer.value.start()
  }
})

vue.onUnmounted(() => {
  if (progressTimer.value) {
    progressTimer.value.stop(false)
  }
})

defineExpose({
  progressTimer,
  percent,
  message,
  status,
})
</script>

<template>
  <div class="pt-2 pb-4">
    <div class="flex items-center rounded-lg relative">
      <div class="relative grow py-2 text-sm font-semibold">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class=" shrink-0 flex items-center">
              <svg
                v-if="+percent < 100"
                class="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <div v-else class="i-tabler-check text-2xl" />
            </div>
            <span class="inline-block capitalize">
              {{ message }}
            </span>
          </div>
          <div class="text-right">
            <span class="inline-block">
              {{ `${percent}%` }}
            </span>
          </div>
        </div>
        <div class="bg-theme-200 dark:bg-theme-700 flex h-2 overflow-hidden rounded text-sm">
          <div
            :style="{ width: `${percent}%` }"
            class="bg-primary-400 flex flex-col justify-center whitespace-nowrap text-center text-white shadow-none transition-all"
          />
        </div>
      </div>
    </div>
    <div
      v-if="status"
      class="text-theme-400 dark:text-theme-500 text-center text-[10px] font-semibold"
    >
      {{ status }}
    </div>
  </div>
</template>

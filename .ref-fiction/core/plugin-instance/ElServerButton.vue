<script lang="ts" setup>
import { onEvent, onResetUi, useService, vue } from '@factor/api'
import type { FictionJobs } from '../plugin-jobs'
import ElServerManager from './ElServerManager.vue'
import { getButtonColors, getServerUiState } from './util'
import type { FictionInstance } from '.'

const { fictionInstance } = useService<{
  fictionJobs: FictionJobs
  fictionInstance: FictionInstance
}>()
const activeJob = vue.computed(() => {
  return fictionInstance.activeJob.value
})
const vis = vue.ref(false)

onResetUi(() => {
  vis.value = false
})

onEvent('showServerManager', () => {
  vis.value = true
})

const status = getServerUiState(fictionInstance)

const colors = vue.computed(() => {
  return getButtonColors({
    status: status.value,
    state: vis.value ? 'active' : 'normal',
  })
})
</script>

<template>
  <div class="relative">
    <span
      class="flex cursor-pointer items-center justify-center space-x-2 rounded-md border px-8 py-1.5 text-sm font-semibold md:px-4"
      :class="[colors.wrapper, vis ? 'shadow-none' : 'shadow-sm']"
      @click.stop="vis = !vis"
    >
      <svg
        v-if="status === 'starting' || fictionInstance.stateLoading.value"
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
      <div v-else class="inline-block">
        <div
          v-if="status === 'running'"
          class="i-heroicons-check-circle text-lg"
        />

        <div v-else class="i-carbon-power text-lg" />
      </div>

      <div
        v-if="!fictionInstance.stateLoading.value"
        class="hidden items-center whitespace-nowrap text-xs md:flex"
      >
        <span class="capitalize">Server {{ status }}</span>

        <span
          v-if="activeJob?.jobType && activeJob?.percent"
          class="ml-2 opacity-60"
        >
          ({{ activeJob?.jobType }} at {{ activeJob.percent }}%)
        </span>

        <div class="i-carbon-chevron-down -mr-1 ml-2 text-base" />
      </div>
    </span>
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-0"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="vis"
        class="divide-theme-100 border-theme-300 absolute left-[105%] top-0 z-40 w-96 max-w-xl divide-y overflow-hidden rounded-md border border-black/20 bg-white shadow-2xl transition-all md:w-[450px]"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <ElServerManager />
      </div>
    </transition>
  </div>
</template>

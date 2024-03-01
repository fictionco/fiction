<script lang="ts" setup>
import ElModal from '@factor/ui/ElModal.vue'
import type { FactorRouter } from '@factor/api'
import { onEvent, replaceAll, useService, vue } from '@factor/api'
import ElBarButton from './ElBarButton.vue'
import ElServerManager from './ElServerManager.vue'
import type { FictionInstance } from '.'

const { fictionInstance } = useService<{
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
}>()
const url = vue.computed(() => {
  const state = fictionInstance.instanceState.value

  if (state.status !== 'running' || !state.publicIp)
    return ''

  const publicIp = state.publicIp || ''

  const ipSlug = replaceAll(publicIp, '.', '-')

  return `https://${ipSlug}_7860.ui.fiction.com`
})

const vis = vue.ref(false)

onEvent('launchWebUi', () => {
  vis.value = true
})
</script>

<template>
  <div>
    <ElBarButton
      text="WebUI"
      icon="i-heroicons-photo"
      @click.stop="vis = !vis"
    />
    <ElModal
      v-model:vis="vis"
      modal-class="w-full h-[100vh]"
      :full-screen="true"
    >
      <div
        class="flex justify-between border-b border-white/20 bg-[#373e50] py-2 px-4 text-xs font-bold text-white"
      >
        <div class="flex space-x-4">
          <div>Fiction - Stable Diffusion WebUI</div>
          <a
            v-if="url"
            class="opacity-60 hover:opacity-100"
            :href="url"
            target="_blank"
          >Open in New Window</a>
        </div>
        <div
          class="flex cursor-pointer items-center space-x-2 hover:opacity-75"
          @click="vis = false"
        >
          <span class="uppercase">Close</span>
          <svg
            class="h-4 w-4"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
      <ElServerManager v-if="!url" class="h-full" />
      <iframe
        v-else
        :src="url"
        width="100%"
        height="100%"
      />
    </ElModal>
  </div>
</template>

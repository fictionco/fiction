<script lang="ts" setup>
import { vue } from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import ThemeEntry from '@kaption/core/plugin-forms/themes/ThemeEntry.vue'
import type { ServiceContainer } from '.'

const service = vue.inject('service') as ServiceContainer
const activeForm = service.kaptionFormLoader.activeForm
const status = vue.computed(() => {
  return service.kaptionFormLoader.activeFormState.value?.status
})
</script>

<template>
  <div class="h-[100vh] w-[100vw]">
    <div
      v-if="!activeForm"
      class="loading-veil fixed inset-0 flex h-full w-full items-center justify-center bg-white text-theme-100"
    >
      <div class="text-center">
        <ElSpinner
          v-if="status === 'loading'"
          class="inline-block h-10 w-10 text-theme-200"
        />
        <div v-else class="text-[11px] text-theme-500">
          <div class="text-theme-400">
            There was a problem loading this form. Does it exist?
          </div>
          <div class="mt-2">
            <a href="https://www.kaption.co">Kaption Homepage &rarr;</a>
          </div>
        </div>
      </div>
    </div>
    <ThemeEntry v-else :form="activeForm" />
  </div>
</template>

<style lang="less"></style>

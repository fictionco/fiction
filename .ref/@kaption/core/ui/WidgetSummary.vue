<script lang="ts" setup>
import { useKaption } from '../utils'
import ElButton from './ElButton.vue'

const { factorRouter } = useKaption()
const trackingCodeLink = factorRouter.link('trackingCode')

const hasData = false
</script>

<template>
  <div>
    <template v-if="!hasData">
      <div class="bg-theme-50 rounded-md p-4">
        <div class="text-theme-700 flex text-xs">
          <div class="shrink-0 text-xl">
            <div class="i-carbon-warning" />
          </div>
          <div class="ml-3">
            <h3 class="font-medium">
              Client Installation Needed
            </h3>
            <div class="text-theme-400 mt-2">
              <p>Install Kaption on your websites to view session replays.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <ElButton
          btn="default"
          format="block"
          :to="trackingCodeLink"
        >
          Install Kaption
        </ElButton>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

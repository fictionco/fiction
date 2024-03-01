<script setup lang="ts">
import { vue } from '@factor/api'
import ElButton from '@kaption/core/ui/ElButton.vue'

const proModalVis = vue.ref(false)
</script>

<template>
  <div class="px-4 py-36">
    <div class="text-center">
      <div class="mb-2">
        <div class="inline-block rounded-full text-primary-700">
          <div class="i-carbon-badge text-3xl" />
        </div>
      </div>
      <h3 class="mt-2 font-medium text-xl">
        Welcome to Pro
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Congratulations. You've upgraded to Pro.
      </p>
      <div class="mt-6">
        <ElButton btn="primary">
          Go to Pro Dashboard &rarr;
        </ElButton>
      </div>
    </div>
  </div>
</template>

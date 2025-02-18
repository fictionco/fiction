<script lang="ts" setup>
import type { SuperTitle } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import XSuperTitle from '@fiction/ui/common/XSuperTitle.vue'

import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { title, subTitle, superTitle, card, value, options = [] } = defineProps<{
  title?: string
  subTitle?: string
  superTitle?: SuperTitle
  options?: InputOption[]
  card: Card
  value: string
}>()
</script>

<template>
  <div
    class="relative z-10 mx-auto w-full p-4 md:p-10 max-w-screen-md"
  >
    <div class="relative z-10 mb-4 flex gap-4 md:text-center md:justify-center">
      <div class="space-y-5">
        <XSuperTitle
          v-if="superTitle"
          class="md:justify-center"
          size="sm"
          :super-title="superTitle"
        />
        <div class="space-y-2">
          <h1 class="x-font-title text-xl font-bold antialiased">
            {{ title }}
          </h1>
          <div class="text-theme-500 dark:text-theme-400 text-lg antialiased">
            {{ subTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="relative z-10 dark:bg-theme-700/40 rounded-lg">
      <FormEngine
        :model-value="{}"
        :state-key="`optionWrap-${value}`"
        input-wrap-class="max-w-lg w-full"
        ui-size="lg"
        :options
        :card
        :disable-group-hide="true"
      />
      <slot />
    </div>
  </div>
</template>

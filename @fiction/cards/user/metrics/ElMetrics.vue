<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { pathCheck, vue } from '@fiction/core'
import XNumber from '@fiction/ui/common/XNumber.vue'
import CardText from '../CardText.vue'
import { schema } from './config.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)
</script>

<template>
  <div>
    <div
      class="mx-auto grid max-w-6xl  px-6 lg:px-8 gap-8 gap-y-12 md:gap-24"
      :class="uc.items?.length === 1 ? 'md:grid-cols-1' : uc.items?.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'"
    >
      <div
        v-for="(feat, i) in uc.items"
        :key="i"
      >
        <div class="text-center">
          <CardText :card tag="h3" :path="pathCheck(`items.${i}.label`, schema)" class="text-xl lg:text-2xl" />

          <XNumber
            :animate="true"
            :model-value="+(feat.value || 0)"
            class="mt-4 text-5xl lg:text-6xl font-bold x-font-title"
            :format="feat.format || 'abbreviated'"
          />

          <CardText :card tag="p" :path="pathCheck(`items.${i}.description`, schema)" class="text-balance text-theme-400 dark:text-theme-500 mt-3 font-sans text-sm " />
        </div>
      </div>
    </div>
  </div>
</template>

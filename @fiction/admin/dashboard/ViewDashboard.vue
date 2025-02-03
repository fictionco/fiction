<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import WidgetArea from './WidgetArea.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const _x = 1
</script>

<template>
  <div class="">
    <div class="md:grid grid-cols-12 divide-x divide-theme-300/50 dark:divide-theme-600/50 md:h-[calc(100dvh-61px)]">
      <div class="col-span-12 xl:col-span-8 h-full overflow-scroll">
        <WidgetArea location="homeMain" :card />
      </div>
      <div class="col-span-12 xl:col-span-4 h-full overflow-scroll">
        <WidgetArea location="homeSecondary" :card />
      </div>
    </div>
  </div>
</template>

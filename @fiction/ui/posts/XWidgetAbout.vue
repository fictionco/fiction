<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '../common/ElAvatar.vue'
import SidebarWidget from './SidebarWidget.vue'

const { card } = defineProps<{
  card: Card
}>()

const org = vue.computed(() => {
  return card.site?.org.value
})
</script>

<template>
  <SidebarWidget title="About">
    <div class="space-y-4 @container/about">
      <div v-if="org?.orgName" class="flex items-center gap-4">
        <ElAvatar v-if="org.avatar?.url" class="size-14" :org />
        <div class="space-y-0.5">
          <div class="font-bold text-base">
            {{ org?.orgName || '' }}
          </div>
          <div class="text-base text-theme-500 dark:text-theme-400">
            {{ org?.headline || 'Author' }}
          </div>
        </div>
      </div>
      <p v-if="org?.about" class="text-theme-600 dark:text-theme-300 text-sm line-clamp-5">
        {{ org?.about }}
      </p>
      <XButton theme="primary" design="outline" size="md" href="#" icon-after="i-tabler-arrow-up-right">
        Subscribe
      </XButton>
    </div>
  </SidebarWidget>
</template>

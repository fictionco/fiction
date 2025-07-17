<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '../../common/ElAvatar.vue'
import SidebarWidget from './SidebarWidget.vue'

const { card } = defineProps<{
  card?: Card
}>()

const org = vue.computed(() => {
  return card?.site?.org.value
})

const headline = vue.computed(() => {
  return org.value?.headline || `Welcome`
})

const about = vue.computed(() => {
  return org.value?.about || `Welcome! Check out our latest posts and updates.`
})
</script>

<template>
  <SidebarWidget>
    <div class="space-y-6 @container/about">
      <div v-if="org?.orgName" class="flex items-center gap-4">
        <ElAvatar v-if="org.avatar?.url" class="size-14" :org />
        <div class="space-y-0.5">
          <div class="font-semibold text-lg md:text-xl">
            {{ org?.orgName || 'no name' }}
          </div>
          <div class="text-base md:text-lg text-theme-500">
            {{ headline }}
          </div>
        </div>
      </div>
      <p class="text-base line-clamp-5">
        {{ about }}
      </p>
      <XButton
        theme="primary"
        design="outline"
        size="md"
        icon-after="i-tabler-arrow-up-right"
        href="?_subscribe=1"
      >
        Subscribe
      </XButton>
    </div>
  </SidebarWidget>
</template>

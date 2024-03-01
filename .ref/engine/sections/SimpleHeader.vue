<script lang="ts" setup>
import type { vue } from '@factor/api'

defineProps({
  settings: {
    type: Object as vue.PropType<{
      homeText: string
      logoComponent?: vue.Component
      nav: { text: string, url: string }[]
    }>,
    required: true,
  },
})
</script>

<template>
  <div class="header edge-padding flex items-center justify-between py-4">
    <div class="logo">
      <RouterLink
        to="/"
        class="hover:text-primary-600 x-font-title block rounded-md text-2xl font-bold transition-all"
      >
        <template v-if="settings.logoComponent">
          <component :is="settings.logoComponent" class="h-6" />
        </template>
        <template v-else>
          {{ settings?.homeText }}
        </template>
      </RouterLink>
    </div>
    <div class="ui-font-button space-x-6">
      <a
        v-for="(item, i) in settings?.nav"
        :key="i"
        :href="item.url"
        class="decoration-theme-300 hover:text-primary-500 font-medium"
      >{{ item.text }}</a>
    </div>
  </div>
</template>

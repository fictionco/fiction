<script lang="ts" setup>
defineOptions({ name: 'SidebarWidget' })

defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="sidebar-widget space-y-4">
    <div v-if="title" class="flex items-center gap-4 border-b border-theme-200 dark:border-theme-700 pb-2">
      <h3 class="font-medium text-theme-500">
        {{ title }}
      </h3>
    </div>
    <div class="">
      <slot />
    </div>
  </div>
</template>

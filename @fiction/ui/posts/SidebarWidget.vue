<script lang="ts" setup>
defineOptions({ name: 'SidebarWidget' })

defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="sidebar-widget space-y-4">
    <div v-if="title" class="flex items-center gap-4">
      <h3 class="font-medium text-theme-900 dark:text-theme-50">
        {{ title }}
      </h3>
      <div class="flex-grow h-px bg-theme-200 dark:bg-theme-700" />
    </div>
    <div class="">
      <slot />
    </div>
  </div>
</template>

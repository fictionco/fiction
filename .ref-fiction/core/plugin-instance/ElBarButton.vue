<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <span
    class="bg-theme-0 border-theme-300 hover:bg-theme-50 text-theme-600 inline-flex cursor-pointer items-center space-x-2 rounded-md border px-4 py-1.5 text-sm font-semibold shadow-sm"
  >
    <div class="text-theme-400 inline-block">
      <div class="text-lg" :class="icon" />
    </div>

    <div v-if="text" class="hidden capitalize md:inline">{{ text }}</div>
    <slot />
  </span>
</template>

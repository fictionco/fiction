<script lang="ts" setup>
defineProps({
  progress: { type: Number, default: undefined },
})
</script>

<template>
  <div class="fixed inset-0 top-0 z-30 h-[1vh] w-full">
    <div class="relative h-full w-full overflow-hidden">
      <div
        class="text-theme-500 bg-theme-900 relative inset-0 h-full w-full opacity-10"
      />
      <div
        class="progress-bar-filled bg-theme-500 absolute left-0 top-0 h-full rounded-r-sm transition-all"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

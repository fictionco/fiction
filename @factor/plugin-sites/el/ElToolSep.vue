<script lang="ts" setup>
defineProps({
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="relative ">
    <div
      class="absolute inset-0 flex items-center"
      aria-hidden="true"
    >
      <div class="w-full border-t border-theme-200" />
    </div>
    <div class="relative flex justify-start">
      <span
        class="bg-theme-0 pr-2 text-[10px] uppercase text-theme-300"
      >{{ text }}</span>
    </div>
  </div>
</template>

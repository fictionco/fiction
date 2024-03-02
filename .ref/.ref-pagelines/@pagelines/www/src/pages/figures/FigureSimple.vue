<script lang="ts" setup>
defineProps({
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="rounded-lg bg-white p-4 ring-1 ring-black/10">
    <div class="text-2xl font-bold">
      {{ text }}
    </div>
    <div class="mt-4 border-t border-slate-200 pt-2">
      <slot />
    </div>
  </div>
</template>

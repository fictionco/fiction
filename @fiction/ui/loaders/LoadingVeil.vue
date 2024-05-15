<script lang="ts" setup>
import ElSpinner from './ElSpinner.vue'
</script>

<template>
  <teleport to=".x-site">
    <div
      class="z-[10001] loading-veil fixed top-0 left-0 flex h-full w-full items-center justify-center bg-white text-slate-300"
    >
      <ElSpinner class="h-12 w-12" />
    </div>
  </teleport>
</template>

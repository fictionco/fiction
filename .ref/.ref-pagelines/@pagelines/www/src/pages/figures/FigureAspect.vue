<script lang="ts" setup>
defineProps({
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="relative">
    <div
      class="absolute -top-10 -right-10 z-0 h-20 w-20 text-theme-200"
      v-html="icon"
    />
    <div
      class="relative z-10 aspect-video w-48 rounded-md bg-white p-4 text-left text-sm shadow-lg ring-1 ring-black/5"
    >
      <div class=" ">
        <div v-if="icon" class="mb-3">
          <div class="text-primary h-6 w-6 shrink-0" v-html="icon" />
        </div>
        <p class="mb-3 min-w-0 text-theme-500">
          {{ text }}
        </p>
      </div>
      <div class="">
        <slot />
      </div>
    </div>
  </div>
</template>

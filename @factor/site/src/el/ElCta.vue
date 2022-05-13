<template>
  <div
    class="mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8"
  >
    <h2 class="text-xl tracking-tight sm:text-2xl">
      <span class="mb-2 block font-semibold text-primary-500">{{ title }}</span>
      <span class="block text-slate-500">{{ subtitle }}</span>
    </h2>
    <div class="mt-4 flex lg:mt-0 lg:shrink-0">
      <slot>
        <ElButton
          btn="primary"
          to="/install"
          class="font-bold shadow md:ml-3 md:py-2.5 md:px-7 md:text-lg"
        >
          Start Now &rarr;
        </ElButton>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ElButton from "@factor/ui/ElButton.vue"

defineProps({
  title: {
    type: String,
    default: "Ready to try it?",
  },
  subtitle: {
    type: String,
    default: "Create a live website in 10 Minutes",
  },
})
</script>

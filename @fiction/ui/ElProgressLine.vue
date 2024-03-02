<script lang="ts" setup>
defineProps({
  percent: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div class="">
    <div class="flex items-center rounded-lg">
      <div
        class="text-theme-300 shrink-0 pb-0.5 text-xs font-extrabold tracking-tight"
      >
        {{ `${percent}%` }} complete
      </div>
      <div class="relative ml-2 grow py-1 text-sm font-semibold">
        <div class="bg-theme-100 flex h-2 overflow-hidden rounded text-sm">
          <div
            :style="{ width: `${percent}%` }"
            class="bg-theme-300 flex flex-col justify-center whitespace-nowrap rounded text-center text-white shadow-none transition-all"
          />
        </div>
      </div>
    </div>
  </div>
</template>

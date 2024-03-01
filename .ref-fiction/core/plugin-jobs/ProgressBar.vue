<script lang="ts" setup>
defineProps({
  percent: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div class="pt-2 pb-4">
    <div class="flex items-center rounded-lg">
      <div class="text-primary-600 shrink-0 px-4">
        {{ `${percent}%` }}
      </div>
      <div class="relative grow py-2 pr-6 text-sm font-semibold">
        <div class="bg-theme-200 flex h-2 overflow-hidden rounded text-sm">
          <div
            :style="{ width: `${percent}%` }"
            class="bg-primary-600 flex flex-col justify-center whitespace-nowrap text-center text-white shadow-none transition-all"
          />
        </div>
      </div>
    </div>
  </div>
</template>

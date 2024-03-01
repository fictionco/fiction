<script lang="ts" setup>
import type { vue } from '@factor/api'

defineProps({
  icon: { type: String, required: true },
  loading: { type: Boolean, default: false },
  dropdownVisible: { type: Boolean, default: false },
  dropdownDirection: {
    type: String as vue.PropType<'left' | 'right' | 'center'>,
    default: 'down',
  },
})
</script>

<template>
  <button class="relative h-8 w-8 transition-all">
    <div
      class="text-md flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-zinc-900/70 hover:bg-zinc-900/100 active:scale-90"
    >
      <svg
        v-if="loading"
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <div
        v-else
        class="text-xl"
        :class="icon"
      />
    </div>
    <div
      v-if="$slots.default && dropdownVisible"
      class="z-10"
      @click.stop
    >
      <div
        class="absolute top-[110%] z-20 w-64 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/10"
        :class="
          dropdownDirection === 'right'
            ? 'left-0 -translate-x-0'
            : dropdownDirection === 'left'
              ? 'right-0 translate-x-0'
              : 'left-1/2 -translate-x-1/2'
        "
      >
        <slot />
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import ElSpinner from './ElSpinner.vue'

defineProps({
  icon: {
    type: String,
    default: undefined,
  },
  subTitle: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
  tags: {
    type: Array as vue.PropType<string[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="relative overflow-hidden rounded-lg">
    <div class="relative z-10 min-w-0">
      <div
        v-if="loading"
        class="flex items-center justify-center p-12 text-slate-300"
      >
        <ElSpinner class="h-6 w-6" />
      </div>
      <div v-else class="mx-auto max-w-xl p-6 text-center md:p-12">
        <template v-if="$slots.super">
          <slot name="super" />
        </template>
        <div
          v-if="subTitle"
          class="text-theme-400 mb-2 flex justify-center space-x-2 text-xs font-semibold uppercase tracking-wide"
        >
          <div>{{ subTitle }}</div>
        </div>
        <p class="font-brand text-2xl font-bold tracking-tight">
          {{ title }}
        </p>
        <div class="text-theme-500 font-brand my-2 text-base font-medium">
          {{ description }}
        </div>
        <template v-if="$slots.sub">
          <slot name="sub" />
        </template>
      </div>
    </div>
    <div
      class="pointer-events-none absolute inset-0 z-0 inline-flex items-center justify-center space-x-4 p-3 xl:mt-0"
    >
      <div class="angled-left absolute inset-0 z-0 bg-gradient-to-br">
        <svg
          class="text-theme-100"
          width="2000"
          height="784"
          fill="none"
          viewBox="0 0 2000 784"
        >
          <defs>
            <pattern
              id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
              x="0"
              y="0"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <g
                id="Page-1"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g id="tic-tac-toe" fill="currentColor">
                  <path
                    id="Combined-Shape"
                    d="M8,16 C12.418278,16 16,12.418278 16,8 C16,3.581722 12.418278,0 8,0 C3.581722,0 0,3.581722 0,8 C0,12.418278 3.581722,16 8,16 Z M8,14 C11.3137085,14 14,11.3137085 14,8 C14,4.6862915 11.3137085,2 8,2 C4.6862915,2 2,4.6862915 2,8 C2,11.3137085 4.6862915,14 8,14 Z M41.4142136,8 L47.363961,2.05025253 L45.9497475,0.636038969 L40,6.58578644 L34.0502525,0.636038969 L32.636039,2.05025253 L38.5857864,8 L32.636039,13.9497475 L34.0502525,15.363961 L40,9.41421356 L45.9497475,15.363961 L47.363961,13.9497475 L41.4142136,8 Z M40,48 C44.418278,48 48,44.418278 48,40 C48,35.581722 44.418278,32 40,32 C35.581722,32 32,35.581722 32,40 C32,44.418278 35.581722,48 40,48 Z M40,46 C43.3137085,46 46,43.3137085 46,40 C46,36.6862915 43.3137085,34 40,34 C36.6862915,34 34,36.6862915 34,40 C34,43.3137085 36.6862915,46 40,46 Z M9.41421356,40 L15.363961,34.0502525 L13.9497475,32.636039 L8,38.5857864 L2.05025253,32.636039 L0.636038969,34.0502525 L6.58578644,40 L0.636038969,45.9497475 L2.05025253,47.363961 L8,41.4142136 L13.9497475,47.363961 L15.363961,45.9497475 L9.41421356,40 Z"
                  />
                </g>
              </g>
            </pattern>
          </defs>
          <rect
            width="2000"
            height="784"
            fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.angled-left {
  clip-path: polygon(0 0, 130% 0, 221% 100%, 0 111%, 100% 0, 0% 0%);
}
</style>

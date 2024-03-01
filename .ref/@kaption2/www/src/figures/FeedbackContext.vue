<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import FigureSimple from './FigureSimple.vue'
</script>

<template>
  <div class="relative aspect-square w-full">
    <FigureSimple
      text="How is your experience so far?"
      class="absolute left-0 top-24 z-0 w-72 shadow-xl"
    >
      <div class="mt-4 flex justify-center space-x-4">
        <ElButton btn="primary">
          Bad
        </ElButton>
        <ElButton btn="primary">
          Ok
        </ElButton>
        <ElButton btn="primary">
          Great
        </ElButton>
      </div>
    </FigureSimple>
    <FigureSimple
      text="Congrats on your purchase. How did it go?"
      class="absolute right-0 top-36 z-10 w-72 shadow-xl"
    >
      <div class="my-2 flex space-x-2 text-amber-400">
        <div
          v-for="s in 5"
          :key="s"
          class=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :fill="s < 4 ? 'currentColor' : ''"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
      </div>
    </FigureSimple>
    <FigureSimple
      text="How do you like the new feature?"
      class="absolute left-12 top-72 z-0 w-72 shadow-xl"
    >
      <div class="my-2 flex space-x-2 text-emerald-400">
        <div
          v-for="s in 5"
          :key="s"
          class=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :fill="s <= 4 ? 'currentColor' : ''"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
      </div>
    </FigureSimple>
  </div>
</template>

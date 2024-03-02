<script lang="ts" setup>
import FigureAspect from './FigureAspect.vue'

const list = ['Improve Follow Up', 'Calls correlated to sale']
const icon = `<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>`
</script>

<template>
  <FigureAspect text="The first 5 days after sign up is crucial." :icon="icon">
    <div
      v-for="item in list"
      :key="item"
      class="flex items-center space-x-3 text-xs font-bold"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="text-primary h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span> {{ item }}</span>
    </div>
  </FigureAspect>
</template>

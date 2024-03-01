<script lang="ts" setup>
import FigureAspect from './FigureAspect.vue'

const list = ['Service', 'Turn Around Time', 'Quality']
const icon = `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
</svg>`
</script>

<template>
  <FigureAspect text="Survey results by cohort" :icon="icon">
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

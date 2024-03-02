<script lang="ts" setup>
import screen from './img/screen-browser.svg'
import fig from './img/screen-browser-fig.svg'
</script>

<template>
  <div
    class="stage border-theme-200 relative mx-6 mb-6 h-48 overflow-hidden border-b py-0 pb-4 lg:h-full lg:overflow-visible"
  >
    <img
      :src="screen"
      class="border-theme-300 absolute top-1/2 left-8 w-[80%] max-w-none -translate-y-1/2 rounded-t-lg border shadow-lg"
    >
    <img
      :src="fig"
      class="border-theme-300 app-adjust-left absolute bottom-24 right-6 w-[40%] rounded-lg border shadow-lg"
    >
  </div>
</template>

<script lang="ts" setup>
import screen from './img/screen-webui.svg'
import fig from './img/screen-webui-fig.svg'
</script>

<template>
  <div class="stage relative mx-12 h-full py-0">
    <img
      :src="screen"
      class="border-theme-300 absolute -bottom-4 left-1/2 w-[70%] -translate-x-1/2 rounded-t-lg border shadow-lg"
    >
    <img
      :src="fig"
      class="border-theme-300 app-adjust-right absolute bottom-12 left-0 w-[30%] rounded-md border shadow-lg"
    >
  </div>
</template>

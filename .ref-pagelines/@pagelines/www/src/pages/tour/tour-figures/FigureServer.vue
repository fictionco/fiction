<script lang="ts" setup>
import screen from './img/screen-server.svg'
import TrainProgress from './TrainProgress.vue'
</script>

<template>
  <div class="stage relative mx-12 hidden h-32 py-0 lg:block lg:h-48">
    <img
      :src="screen"
      class="border-theme-300 w-[60%] rounded-t-lg border shadow-lg"
    >
    <TrainProgress class="absolute bottom-12 w-full scale-50" />
  </div>
</template>

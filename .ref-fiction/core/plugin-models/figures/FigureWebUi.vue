<script lang="ts" setup>
import ss from '../../img/webui.jpg'
</script>

<template>
  <div class="relative h-full w-full">
    <div class="absolute left-1/2 bottom-0 w-64 -translate-x-1/2 md:w-96">
      <img :src="ss" class="aspect-[16/9] rounded-t-lg shadow-xl">
    </div>
  </div>
</template>

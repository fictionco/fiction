<script lang="ts" setup>
import avatarBefore from '../../img/avatar-before-1.png'
import avatar1 from '../../img/avatar-after-1.png'
import avatar2 from '../../img/avatar-after-2.jpg'
</script>

<template>
  <div
    class="w-ful absolute bottom-0 left-1/2 mt-4 flex h-full -translate-x-1/2 items-center space-x-4 rounded-lg p-3 xl:mt-0"
  >
    <div class="w-16">
      <img :src="avatarBefore" class="w-20 rounded-lg shadow-md">
    </div>
    <div class="text-theme-400 text-4xl">
      <div class="i-carbon-arrow-right" />
    </div>
    <div class="relative aspect-video w-32 md:w-48">
      <img
        :src="avatar1"
        class="absolute right-0 aspect-square w-20 rounded-lg shadow-md"
      >
      <img
        :src="avatar2"
        class="absolute right-16 top-16 w-16 rounded-lg shadow-md md:w-24"
      >
    </div>
  </div>
</template>

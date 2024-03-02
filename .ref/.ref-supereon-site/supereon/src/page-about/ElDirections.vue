<script lang="ts" setup>
import office from './office.webp'
</script>

<template>
  <div class="text-theme-800 relative z-10 my-12 p-8 md:p-16">
    <div class="grid grid-cols-1 gap-12">
      <div class="mx-auto text-center">
        <div
          class="bg-theme-0 text-theme-900 mb-4 inline-flex justify-center rounded-xl p-2 text-center text-xl"
        >
          <div class="i-heroicons-map-pin text-6xl" />
        </div>
        <h1 class="font-cal m-auto mb-4 text-4xl sm:text-6xl">
          Based in the USA
        </h1>
        <p class="text-theme-600 text-2xl sm:max-w-lg">
          Supereon's offices are in
          <span class="text-theme-600">Irvine, California</span>.
        </p>
      </div>
      <div class="text-center">
        <img :src="office" class="relative inline-block rounded-lg">
      </div>
    </div>
  </div>
</template>

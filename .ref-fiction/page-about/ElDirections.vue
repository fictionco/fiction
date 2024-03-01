<script lang="ts" setup>
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import office from './office.webp'
</script>

<template>
  <ContentBox class="relative z-10 my-12" wrap-class="p-8 md:p-16">
    <div class="grid gap-12 md:grid-cols-2">
      <div class="">
        <div
          class="bg-theme-100 text-theme-800 mb-4 inline-flex justify-center rounded-xl p-2 text-xl"
        >
          <div class="i-heroicons-map-pin text-6xl" />
        </div>
        <h1 class="m-auto mb-4 text-4xl font-extrabold sm:text-6xl">
          Built in the USA
        </h1>
        <p class="text-theme-600 text-2xl sm:max-w-lg">
          Fiction's office is in
          <span class="text-white">Irvine, California</span>. We also hire in
          <span class="text-white">Utah</span>,
          <span class="text-white">San Francisco Bay Area</span>, and
          <span class="text-white">Argentina</span>.
        </p>
      </div>
      <div>
        <img
          :src="office"
          class="relative rounded-lg md:-mr-12 md:translate-x-24"
        >
      </div>
    </div>
  </ContentBox>
</template>

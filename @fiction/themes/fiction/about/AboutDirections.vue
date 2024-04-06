<script lang="ts" setup>
import ElemMap from './AboutMap.vue'
</script>

<template>
  <div class="mt-20">
    <section
      class="relative z-20 mx-auto -mb-20 max-w-3xl rounded dark:bg-theme-900 p-12 px-4 text-center shadow-xl ring-1 ring-black/10 md:px-20 lg:px-12"
    >
      <h1
        class="m-auto mb-4 text-3xl font-extrabold sm:text-4xl x-font-title"
      >
        Made in Utah and California
      </h1>
      <p class="m-auto text-xl text-theme-500 sm:max-w-lg">
        Fiction's office walking distance of the pacific coast highway and the
        beach.
      </p>
      <div class="mt-4 inline-flex justify-center text-xl">
        <svg
          class="text-primary-500 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <div class="ml-3 block">
          <div class="font-bold">
            Irvine, California
          </div>
        </div>
      </div>
    </section>

    <div class=" ">
      <ElemMap container="mapContainer" />
    </div>
  </div>
</template>

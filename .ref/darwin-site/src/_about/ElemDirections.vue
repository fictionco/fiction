<template>
  <div class="overflow-x-hidden">
    <section
      class="
        pt-12
        lg:pt-28
        mx-auto
        max-w-7xl
        px-4
        md:px-20
        lg:px-12
        text-center
      "
    >
      <h1
        class="
          mb-4
          text-3xl
          font-extrabold
          sm:text-4xl
          lg:text-6xl
          xl:text-7xl
          m-auto
        "
      >
        Made in California
      </h1>
      <p class="mb-12 text-xl text-bluegray-500 m-auto sm:max-w-lg lg:mb-20">
        Darwin's office walking distance of the pacific coast highway and the
        beach.
      </p>
    </section>
    <div
      class="
        grid grid-cols-1
        gap-8
        md:grid-cols-2 md:gap-0
        m-auto
        max-w-xl
        my-16
      "
    >
      <p class="flex text-xl justify-center">
        <svg
          class="flex-shrink-0 h-6 w-6 text-primary-500"
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

        <span class="ml-3"
          ><div class="">950 Glenneyre St.</div>
          <div class="text-bluegray-500">Laguna Beach, CA</div>
          <div class="text-bluegray-500">92651</div>
        </span>
      </p>
      <p class="flex text-xl justify-center">
        <svg
          class="flex-shrink-0 h-6 w-6 text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>

        <span class="ml-3"
          ><a
            href="mailto:hello@fiction.com"
            class="inline-block hover:text-primary-500"
            >hello@darwin.so</a
          >
        </span>
      </p>
    </div>

    <div class="my-10"><ElemMap container="mapContainer" /></div>
  </div>
</template>
<script lang="ts">
import ElemMap from "./ElemMap.vue"

export default {
  components: {
    ElemMap,
  },
  setup() {
    return {}
  },
}
</script>

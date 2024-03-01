<script lang="ts" setup>
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import office from './office.webp'
</script>

<template>
  <ContentBox class="relative z-10 my-12" wrap-class="p-8 md:p-16">
    <div class="font-brand grid gap-12 md:grid-cols-2">
      <div>
        <div class="">
          <div
            class="bg-primary-600 text-primary-100 mb-4 inline-flex justify-center rounded-full p-2 text-xl"
          >
            <div class="i-heroicons-map-pin text-6xl" />
          </div>
          <h1 class="m-auto mb-4 text-3xl font-bold sm:text-4xl">
            Based in California
          </h1>
          <p class="text-theme-600 text-2xl sm:max-w-lg">
            Fiction's office is in
            <span class="text-theme-800">Irvine, California</span>. We also hire
            in <span class="text-theme-800">Utah</span>,
            <span class="text-theme-800">San Francisco Bay Area</span>, and
            <span class="text-theme-800">Argentina</span>.
          </p>
        </div>
        <div class="">
          <h1 class="font-brand m-auto mb-4 text-4xl font-bold sm:text-4xl">
            Work With Us
          </h1>
          <p class="text-theme-600 text-2xl sm:max-w-lg">
            PageLines is looking to build a world-class team of talented people.
          </p>
          <div class="mt-6 text-2xl">
            Interested? &rarr;
            <a
              href="mailto:hello@pagelines.com"
              class="text-primary-500 hover:text-primary-600"
            >Email Us Your Resume
            </a>
          </div>
        </div>
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

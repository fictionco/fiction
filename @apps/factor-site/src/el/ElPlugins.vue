<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:flex justify-between items-center py-8">
      <div>
        <h2 class="text-3xl font-bold">Plugins</h2>
        <div class="text-color-500">
          Create and run your web app with Factor and extensions.
        </div>
      </div>
      <div class="mt-3 lg:mt-0">
        <ElButton
          btn="default"
          to="/plugins"
          class="font-bold hover:text-primary-500"
        >
          Browse All &rarr;
        </ElButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <a
        v-for="(item, i) in plugins"
        :key="i"
        class="group flex py-4 pr-4 rounded-lg transition-all hover:shadow-xl"
        :href="item.url"
        target="_blank"
      >
        <img
          :src="item.icon"
          :alt="item.name"
          class="w-24 h-24 mr-8 rounded-lg shadow-lg shrink-0 transition duration-300 ease-in-out origin-top-right transform scale-100 group-hover:scale-75"
        />
        <div class="min-w-0">
          <h1 class="text-3xl mb-2 font-bold">{{ item.name }}</h1>
          <p class="line-clamp-2 text-color-500 text-xl">
            {{ item.description }}
          </p>
        </div>
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import ElButton from "@factor/ui/ElButton.vue"

import { map as plugins } from "../plugins/map"
</script>

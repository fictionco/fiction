<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="items-center justify-between py-8 lg:flex">
      <div>
        <h2 class="text-3xl font-bold">Plugins</h2>
        <div class="text-slate-500">
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
        class="group flex rounded-lg py-4 pr-4 transition-all hover:shadow-xl"
        :href="item.url"
        target="_blank"
      >
        <img
          :src="item.icon"
          :alt="item.name"
          class="mr-8 h-24 w-24 shrink-0 origin-top-right scale-100 rounded-lg shadow-lg transition duration-300 ease-in-out group-hover:scale-75"
        />
        <div class="min-w-0">
          <h1 class="mb-2 text-3xl font-bold">{{ item.name }}</h1>
          <p class="line-clamp-2 text-xl text-slate-500">
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

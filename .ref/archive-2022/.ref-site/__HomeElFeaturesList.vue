<script lang="ts" setup>
import { featureGroups } from './featureMap'
</script>

<template>
  <section>
    <div class="max-w-4xl text-center mx-auto">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-6xl lg:pr-7">
        {{ title }}
      </h2>
      <p class="mt-8 text-base text-slate-500 leading-relaxed md:text-xl">
        {{ content }}
      </p>
    </div>
    <div class="pt-12 lg:pt-24">
      <div class="flex flex-col justify-between w-full items-start lg:flex-row">
        <template v-for="(feature, i) in featureGroups.analytics" :key="i">
          <router-link
            :to="feature?.path ?? '/'"
            class="flex-1 block mb-12 lg:mb-0 shadow-lg border border-slate-300 rounded-lg"
            :class="i === 1 ? 'lg:mx-5' : ''"
          >
            <div
              class="p-6 flex items-center space-x-3 border-b border-slate-400 justify-center"
            >
              <div
                class="w-6 h-6"
                :class="feature?.class"
                v-html="feature?.icon"
              />
              <div class="text-lg font-semibold">
                {{ feature?.name }}
              </div>
            </div>
            <div
              class="pt-6 pl-6 overflow-hidden bg-slate-100 shadow-inner hover:bg-slate-50"
            >
              <img
                :src="feature?.thumb"
                :alt="`${feature?.name} Screenshot`"
                class="-mb-48 xl:mb-0 w-full shadow-xl border-t border-l border-black border-opacity-10 rounded-tl-lg"
              >
            </div>
            <p
              class="px-4 py-6 text-center text-sm text-slate-500 border-t border-slate-300"
            >
              {{ feature?.description }}
            </p>
          </router-link>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { FeaturePageParams } from '../featureMap'

defineProps({
  aspect: { type: Object as PropType<FeaturePageParams>, default: undefined },
})
</script>

<template>
  <section class="mx-auto px-6 py-12 lg:pt-32 lg:pb-16">
    <div class="text-left md:text-center">
      <h2
        class="m-auto max-w-4xl text-4xl font-extrabold tracking-tight lg:text-6xl"
        v-html="aspect?.name"
      />

      <div
        class="m-auto mt-8 max-w-2xl text-lg leading-relaxed text-theme-500 sm:text-2xl"
        v-html="aspect?.description"
      />
    </div>
    <div class="text-center">
      <component
        :is="aspect?.figure"
        v-if="aspect?.figure"
        class="my-12 mx-auto max-w-3xl"
      />

      <div v-else-if="aspect?.aspects" class="my-12 mx-auto max-w-6xl">
        <ul
          role="list"
          class="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8"
        >
          <li
            v-for="grid in aspect?.aspects"
            :key="grid.name"
            class="relative flex flex-col"
          >
            <div class="group flex grow items-end">
              <div>
                <component
                  :is="grid.figure"
                  v-if="grid.figure"
                  class="pointer-events-none max-h-64"
                />
              </div>
            </div>
            <div class="mt-8 text-left">
              <h3
                class="pointer-events-none mt-2 block truncate text-2xl font-bold"
              >
                {{ grid.name }}
              </h3>
              <p class="text-color-800 pointer-events-none mt-4 block text-xl">
                {{ grid.description }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

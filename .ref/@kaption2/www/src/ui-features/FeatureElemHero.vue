<script lang="ts" setup>
import type { PropType } from 'vue'
import type { FeaturePage, FeaturePageParams } from '../featureMap'

defineProps({
  aspect: { type: Object as PropType<FeaturePageParams>, default: undefined },
  currentFeature: {
    type: Object as PropType<FeaturePage<string>>,
    default: undefined,
  },
})
</script>

<template>
  <section
    class="mx-auto py-12 px-4 md:max-w-sm md:px-20 lg:max-w-7xl lg:rounded-lg lg:py-24"
  >
    <div class>
      <div class="grid grid-cols-12 items-center justify-center gap-8">
        <div
          class="col-span-12 lg:col-span-6"
          :class="[aspect?.align === 'right' ? 'lg:col-start-8' : 'lg:pr-20']"
        >
          <div class="text-primary-400 text-sm uppercase tracking-wider">
            {{ aspect?.tagline }}
          </div>
          <h2
            class="mt-4 mb-12 max-w-md text-3xl font-bold tracking-tight lg:text-5xl"
          >
            {{ aspect?.name }}
          </h2>
          <div
            class="text-2xl text-theme-700 md:max-w-3xl"
            v-html="aspect?.description"
          />

          <ul role="list" class="text-base">
            <li
              v-for="grid in aspect?.aspects"
              :key="grid.name"
              class="relative flex flex-col"
            >
              <div class="mt-8 text-left">
                <h3 class="pointer-events-none mt-2 block truncate font-bold">
                  {{ grid.name }}
                </h3>
                <p class="text-color-800 pointer-events-none mt-1 block">
                  {{ grid.description }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="relative col-span-12 lg:col-span-6"
          :class="[aspect?.align === 'right' ? 'lg:order-first' : '']"
        >
          <component
            :is="aspect?.figure"
            format="hero"
            :feature-id="currentFeature?.key"
          />
        </div>
      </div>
    </div>
  </section>
</template>

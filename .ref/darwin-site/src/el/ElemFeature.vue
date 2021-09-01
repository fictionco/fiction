<template>
  <section
    class="
      mx-auto
      py-12
      md:max-w-sm
      lg:max-w-7xl lg:py-24
      px-4
      md:px-20
      lg:px-12
    "
  >
    <div class="grid grid-cols-12 items-center justify-center gap-8 xl:gap-24">
      <div
        class="lg:col-span-6 lg:pr-20"
        :class="[aspect.align == 'right' ? 'lg:col-start-8' : '']"
      >
        <div class="text-sm uppercase tracking-wider text-primary-400">
          {{ aspect.tagline }}
        </div>
        <h2 class="max-w-md mt-4 mb-12 text-7xl tracking-tight font-extrabold">
          {{ aspect.name }}
        </h2>
        <div
          class="text-2xl text-bluegray-500 md:max-w-3xl"
          v-html="aspect.description"
        />
      </div>
      <div
        class="relative lg:col-span-6"
        :class="[aspect.align == 'right' ? 'lg:order-first' : '']"
      >
        <img
          v-if="aspect.screenshot"
          class="w-full"
          :src="aspect.screenshot"
          :alt="aspect.name"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from "vue"
import { FeatureType } from "../util"
export default {
  props: {
    aspect: { type: Object as PropType<FeatureType>, default: () => {} },
  },
  setup() {
    return {}
  },
}
</script>

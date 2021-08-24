<template>
  <section class="mx-auto py-12 lg:py-16">
    <div class="text-center">
      <h2
        class="
          m-auto
          max-w-4xl
          text-3xl
          font-extrabold
          tracking-tight
          lg:text-6xl
        "
        v-html="aspect.name"
      />

      <div
        class="
          m-auto
          max-w-2xl
          mt-8
          px-6
          text-base text-bluegray-500
          leading-relaxed
          md:text-xl
        "
        v-html="aspect.description"
      />
    </div>
    <div class="text-center">
      <component :is="aspect.figure" v-if="aspect.figure" />
      <img
        v-else-if="aspect.screenshot"
        class="inline-block max-w-xl my-12"
        :src="aspect.screenshot"
        :alt="aspect.name"
      />
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

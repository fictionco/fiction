<script lang="ts" setup>
import type { PropType } from 'vue'
import type { FeaturePage } from './featureMap'
import CtaGetDemo from './CtaGetDemo.vue'
import EffectGridBg from './EffectGridBg.vue'

defineProps({
  currentFeature: {
    type: Object as PropType<FeaturePage<string>>,
    default: undefined,
  },
})
</script>

<template>
  <div
    class="relative text-white bg-gradient-to-br from-slate-900 via-black to-primary-900 pt-32 border-b border-slate-300"
  >
    <div class="overflow-hidden sm:pt-12 py-8 lg:py-20 pt-16">
      <div
        class="text-area mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24"
      >
        <div v-if="currentFeature?.align === 'right'" />
        <div>
          <div>
            <div class="w-16 h-16" v-html="currentFeature?.icon" />
          </div>
          <div class="mt-6">
            <div class="mt-6 sm:max-w-xl">
              <h1
                class="text-4xl font-extrabold tracking-tight sm:text-6xl"
                v-html="currentFeature?.name"
              />

              <div
                class="mt-6 text-2xl text-slate-300"
                v-html="currentFeature?.description"
              />
            </div>
            <div class="my-10">
              <CtaGetDemo />
            </div>
          </div>
        </div>
      </div>

      <div class="sm:mx-auto sm:max-w-2xl sm:px-6">
        <div
          class="py-24 relative sm:mt-12 sm:py-32 lg:absolute lg:w-1/2 lg:inset-y-0 z-10"
          :class="
            currentFeature?.align === 'right'
              ? 'lg:left-0 lg:right-full'
              : 'lg:right-0'
          "
        >
          <div
            class="relative pl-4 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full"
            :class="
              currentFeature?.align === 'right'
                ? 'lg:mr-12  lg:-ml-40'
                : 'lg:pl-12  -mr-40'
            "
          >
            <component :is="currentFeature?.figure" />
          </div>
        </div>
      </div>
    </div>
    <EffectGridBg />
  </div>
</template>

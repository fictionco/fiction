<script lang="ts" setup>
import { toLabel } from '@factor/api'
import type { PropType } from 'vue'
import type { FeaturePage } from '../featureMap'
import CtaMain from '../ui/CtaMain.vue'
import EffectGridBg from '../ui/EffectGridBg.vue'

defineProps({
  currentFeature: {
    type: Object as PropType<FeaturePage<string>>,
    default: undefined,
  },
})
</script>

<template>
  <div class="pb-8">
    <div
      class="to-primary-900 relative border-b border-slate-300 bg-gradient-to-br from-slate-900 via-black pt-32 text-white"
    >
      <div
        class="relative z-10 mx-auto max-w-7xl px-4 py-8 pt-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="md:text-center">
          <div class="mx-auto max-w-2xl">
            <div
              class="mb-8 items-center justify-center text-left text-xl font-bold md:flex"
            >
              <div class="mr-3 flex items-center space-x-3 md:justify-center">
                <div
                  class="bg-gradient-to-r from-amber-200 to-amber-300 box-decoration-clone bg-clip-text text-transparent"
                >
                  {{ toLabel(currentFeature?.category) }}
                </div>
                <div class="text-amber-300">
                  <div
                    class="mb-0.5 h-5 w-5"
                    v-html="currentFeature?.icon"
                  />
                </div>
              </div>
              <div
                class="bg-gradient-to-r from-amber-300 to-amber-400 box-decoration-clone bg-clip-text text-transparent"
              >
                {{ currentFeature?.name }}
              </div>
            </div>
            <h1
              class="mt-1 text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl"
            >
              {{ currentFeature?.heading || currentFeature?.name }}
            </h1>
            <p class="mx-auto mt-5 text-2xl">
              {{ currentFeature?.description }}
            </p>

            <CtaMain class="mt-6" />
          </div>

          <div class="relative z-10 -mb-32 py-16 md:-mb-48">
            <div v-if="currentFeature?.figure" class="mx-auto max-w-4xl">
              <component
                :is="currentFeature?.figure"
                :feature-id="currentFeature?.key"
                format="splash"
              />
            </div>
          </div>
        </div>
      </div>
      <EffectGridBg />
    </div>
  </div>
</template>

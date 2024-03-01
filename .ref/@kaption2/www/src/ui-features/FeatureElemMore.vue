<script lang="ts" setup>
import { computed } from 'vue'
import { featureList } from '../featureMap'
import GridBg from '../ui/EffectGridBg.vue'

defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  features: { type: Array, default: () => [] },
})
const list = computed(() => {
  return featureList.filter(_ => _.path)
})
</script>

<template>
  <section class="bg-color-50 relative pt-6 pb-12">
    <div
      class="relative z-10 mx-auto max-w-lg py-12 px-4 md:max-w-7xl md:px-20 lg:py-16 lg:px-12"
    >
      <div class="text-center">
        <h2 class="text-5xl font-extrabold tracking-tight">
          The Experience Engine
        </h2>
        <p class="text-color py-4 text-xl">
          Kaption is a full-featured platform for managing customer experiences
          and feedback.
        </p>
      </div>
      <div class="pt-8">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <template v-for="feature in list" :key="feature.name">
            <router-link
              class="group flex cursor-pointer space-x-4 rounded bg-white p-6 shadow ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-black/10"
              :to="feature?.path"
            >
              <span class="text-primary-500 mt-1 w-10">
                <span class="inline-block h-6 w-6" v-html="feature?.icon" />
              </span>
              <span class="min-w-0">
                <span class="mb-2 block">
                  <span class="mb-1 block text-xl font-bold">
                    {{ feature?.name }}
                  </span>
                  <span
                    class="text-color-500 block text-xs font-semibold uppercase tracking-widest"
                  >{{ feature?.category }}</span>
                </span>
                <span
                  class="text-color block text-base"
                  v-html="feature?.description"
                />
              </span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
    <GridBg mode="light" />
  </section>
</template>

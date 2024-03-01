<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import screenshot from '../../ui-analytics/img/analyticsDashboardScreen.webp'

defineProps({
  title: { type: String, default: '' },
  note: { type: String, default: '' },
})
</script>

<template>
  <div>
    <div
      class="overflow-hidden rounded-lg border border-slate-300 bg-white lg:grid lg:grid-cols-2 lg:gap-4"
    >
      <div
        class="flex flex-col justify-center px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:p-20"
      >
        <div class="lg:self-center">
          <div class="text-theme-400 mb-2 text-xs font-semibold uppercase">
            Documentation
          </div>
          <h2 class="text-xl font-bold xl:text-3xl">
            <span class="block">Welcome to Fiction Docs</span>
          </h2>
          <p class="text-ll text-theme-500 mt-4 leading-6">
            Here you can learn all about how to use and leverage Kaption's tools
            to create results for your customers and business.
          </p>

          <div class="mt-6">
            <ElButton btn="primary" to="/docs/install">
              Install Kaption &rarr;
            </ElButton>
          </div>
        </div>
      </div>
      <div class="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 -mt-6">
        <img
          class="translate-x-6 translate-y-6 rounded-md object-cover object-left-top shadow-xl ring-1 ring-black/10 sm:translate-x-16 lg:translate-y-20"
          :src="screenshot"
          alt="App screenshot"
        >
      </div>
    </div>
  </div>
</template>

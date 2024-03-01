<script lang="ts" setup>
import { activeSelectedDashboard } from '@kaption/core/dataEngine'
import { RouteUtil } from '@kaption/core'
import { computed } from 'vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { stored } from '@factor/api'
import ElButton from '@kaption/core/ui/ElButton.vue'

defineProps({
  title: { type: String, default: '' },
  note: { type: String, default: '' },
})
const loading = computed(() => stored('customerLoading'))
</script>

<template>
  <div class="mx-auto max-w-7xl py-8">
    <div v-if="loading" class="flex justify-center pt-32 text-slate-300">
      <ElSpinner class="h-12 w-12" />
    </div>
    <div
      v-else
      class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl lg:grid lg:grid-cols-2 lg:gap-4"
    >
      <div
        class="flex flex-col justify-center px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:p-20"
      >
        <div class="lg:self-center">
          <div class="mb-2 text-xs font-semibold uppercase text-slate-400">
            Upgrade to unlock
            {{ activeSelectedDashboard.dashboardName }}
          </div>
          <h2 class="text-xl font-bold xl:text-3xl">
            <span class="block">Get professional data &amp; insights</span>
          </h2>
          <p class="text-ll mt-4 leading-6 text-slate-500">
            This feature (and much more) is available with the pro plan. The
            good news is we have a free trial, and pro pays for itself with a
            single insight.
          </p>

          <div class="mt-6">
            <ElButton btn="primary" :to="RouteUtil.to('billingUpgrade')">
              Start Your Free Trial &rarr;
            </ElButton>
          </div>
        </div>
      </div>
      <div class="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 -mt-6">
        image goes here
      </div>
    </div>
  </div>
</template>

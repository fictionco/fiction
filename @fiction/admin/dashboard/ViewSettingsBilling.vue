<script lang="ts" setup>
import { standardDate, useService, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { Card } from '@fiction/site/card'
import ElPanelSettings from './ElPanelSettings.vue'
import type { NavCardUserConfig } from '../index.js'

defineProps({
  card: { type: Object as vue.PropType<Card<NavCardUserConfig>>, required: true },
})

const { fictionStripe, fictionUser } = useService<{ fictionStripe?: FictionStripe }>()

// const sending = vue.ref('')
// const coupon = vue.ref()

vue.onMounted(async () => {
  await fictionStripe?.setCustomerData()
})

const activeCustomer = vue.computed(() => {
  return fictionStripe?.activeCustomer.value
})
</script>

<template>
  <div class="space-y-6">
    <ElPanelSettings title="Usage and Billing">
      <div class="my-4 grid grid-cols-1 gap-8 text-sm md:grid-cols-2">
        <div class="">
          <div class="mb-6">
            <div class="mb-3 font-bold">
              Current Plan
            </div>
            <div class="x-font-title text-2xl font-bold text-theme-500 dark:text-theme-100 ">
              {{ activeCustomer?.planName || 'Unknown' }}
            </div>
          </div>
          <div class="mb-3 font-bold">
            Service Usage
          </div>
          <div v-if="fictionStripe" class="mt-2 space-y-4">
            <div class="relative">
              <div class="relative flex items-center space-x-3">
                <div>
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white dark:text-black ring-4 ring-white dark:ring-emerald-300"
                  >
                    <div class="i-heroicons-calendar-days text-xl" />
                  </span>
                </div>
                <div class="">
                  <div class="text-theme-500 text-xs">
                    Current Cycle
                  </div>
                  <div class="font-bold">
                    {{ standardDate(fictionStripe.cycleStartAtIso.value) }}
                    to
                    {{ standardDate(fictionStripe.cycleEndAtIso.value) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-theme-50 dark:bg-theme-800 rounded-md my-2 p-4 text-xs font-semibold">
            No Data
          </div>
        </div>
        <div class="max-w-prose">
          <div class="font-bold">
            Billing Dashboard
          </div>
          <div class="text-theme-600 dark:text-theme-100">
            <p class="my-4">
              We partner with Stripe to handle payments and billing. To
              view invoices, change plan or payment method, please visit the
              billing dashboard...
            </p>
            <p class="my-4">
              Use your billing email to login:
              <span class="font-bold">{{ fictionUser.activeOrganization.value?.orgEmail }}</span>
            </p>
          </div>
          <div class="mt-6">
            <ElButton :href="fictionStripe?.customerPortalUrl.value" btn="primary">
              Billing Dashboard &rarr;
            </ElButton>
          </div>
        </div>
      </div>
    </ElPanelSettings>
  </div>
</template>

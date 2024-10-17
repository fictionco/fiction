<script lang="ts" setup>
import type { FictionStripe } from '@fiction/plugins/plugin-stripe'
import type { Card } from '@fiction/site'
import { standardDate, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import SettingsPanel from './SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
const { fictionStripe, fictionUser } = useService<{ fictionStripe?: FictionStripe }>()
const activeCustomer = vue.computed(() => {
  return fictionStripe?.activeCustomer.value
})

const header = vue.computed(() => {
  return {
    title: `Current Plan: ${activeCustomer.value?.planName || 'None'}`,
    subTitle: 'Manage Your Payment and Billing',
    media: { class: 'i-tabler-credit-card' },
    actions: [
      {
        name: 'Billing Dashboard',
        href: fictionStripe?.customerPortalUrl.value,
        theme: 'primary' as const,
      },
    ],
  }
})
</script>

<template>
  <SettingsPanel
    title="Billing and Usage"
    :header
  >
    <div class="p-8 space-y-8">
      <div class="">
        <div class="mb-3 font-bold">
          Service Usage
        </div>
        <div v-if="activeCustomer" class="mt-2 space-y-4">
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
                  {{ standardDate(fictionStripe?.cycleStartAtIso.value) }}
                  to
                  {{ standardDate(fictionStripe?.cycleEndAtIso.value) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-theme-50 dark:bg-theme-800 rounded-md my-2 p-8 text-sm font-semibold">
          No Customer Was Found
        </div>
      </div>
      <div class="max-w-prose">
        <div class="font-bold">
          Billing Dashboard
        </div>
        <div class="text-theme-600 dark:text-theme-100">
          <p class="my-4 text-theme-500 dark:text-theme-400">
            We use Stripe to handle payments and billing. To
            view invoices, change plan or payment method, please visit the
            billing dashboard...
          </p>
          <p class="my-4">
            Use your billing email to login:
            <span class="font-bold">{{ fictionUser.activeOrganization.value?.orgEmail }}</span>
          </p>
        </div>
        <div class="mt-6">
          <XButton :href="fictionStripe?.customerPortalUrl.value" theme="primary">
            Billing Dashboard &rarr;
          </XButton>
        </div>
      </div>
    </div>
  </SettingsPanel>
</template>

<script lang="ts" setup>
import { standardDate, useService, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { Card } from '../../../card'
import ElPanelSettings from './ElPanelSettings.vue'

type UserConfig = { isNavItem?: boolean, icon?: string, parentItemId?: string }
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
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

// const upgradeActions = vue.computed<MenuItem[]>(() => {
//   const upgradeTier = activeCustomer.value?.upgradeTier
//   const upgradeQuantity = activeCustomer.value?.upgradeQuantity

//   const actions = []
//   if (upgradeTier) {
//     actions.push({
//       name: `Upgrade To ${toLabel(
//         upgradeTier?.group,
//       )} ($${upgradeTier?.cost}/mo)`,
//       onClick: () => changePlan(upgradeTier),
//       btn: 'primary',
//       size: 'lg',
//     })
//   }

//   return actions
// })

// async function changePlan(args: CustomerDetails) {
//   const subscriptionId = fictionStripe.activeCustomer.value?.subscriptionId

//   if (subscriptionId) {
//     const confirmed = confirm('Are you sure?')
//     if (!confirmed)
//       return
//     const { quantity } = args
//     sending.value = 'change'
//     await fictionStripe.requestManageSubscription('change', {
//       priceId: args.priceId,
//       subscriptionId,
//       coupon: coupon.value,
//       quantity,
//     })

//     await fictionStripe.setCustomerData()
//   }
//   else {
//     location.href = await fictionStripe.getCheckoutUrl({
//       priceId: args.priceId,
//       loginPath: '/auth/login',
//     })
//   }

//   sending.value = ''
// }

// async function cancelPlan(args?: CustomerDetails) {
//   const subscriptionId = args?.subscriptionId

//   if (!subscriptionId)
//     throw new Error('no subscription id')

//   const confirmed = confirm(
//     'Are you sure? This will cancel your subscription, as remove access to your data and AI tools',
//   )
//   if (!confirmed)
//     return
//   sending.value = 'delete'
//   await fictionStripe.requestManageSubscription('cancel', {
//     priceId: args.priceId,
//     subscriptionId,
//   })

//   await fictionStripe.setCustomerData()

//   sending.value = ''
// }
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
            <div class="font-brand text-3xl font-bold">
              {{ activeCustomer?.planName }}
            </div>
          </div>
          <div class="mb-3 font-bold">
            Service Usage
          </div>
          <div
            v-if="fictionStripe?.usage.activeUsage.value"
            class="mt-2 space-y-4"
          >
            <div class="relative">
              <div class="relative flex items-center space-x-3">
                <div>
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white ring-4 ring-white"
                  >
                    <div class="i-heroicons-calendar-days text-xl" />
                  </span>
                </div>
                <div class="">
                  <div class="text-theme-500 text-xs">
                    Current Cycle
                  </div>
                  <div class="font-bold">
                    {{ standardDate(fictionStripe.usage.activeUsage.value.cycleStartAtIso) }}
                    to
                    {{ standardDate(fictionStripe.usage.activeUsage.value.cycleEndAtIso) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="relative flex items-center space-x-3">
                <div>
                  <span
                    class="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-md text-white ring-4 ring-white"
                  >
                    <div class="i-heroicons-clock text-xl" />
                  </span>
                </div>
                <div class=" ">
                  <div class="text-theme-500 text-xs">
                    Credits Used This Cycle:
                  </div>
                  <div class="font-bold">
                    {{ fictionStripe.usage.activeUsage.value.usedCredits }} of
                    {{ fictionStripe.usage.activeUsage.value.paidCredits }}
                    credits ({{
                      fictionStripe.usage.activeUsage.value.percentUsed || 0
                    }}%)
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
          <div class="text-slate-600">
            <p class="my-4">
              PageLines partners with Stripe to handle payments and billing. To
              view invoices, change plan or payment method, please visit the
              billing dashboard...
            </p>
            <p class="my-4">
              Use your billing email to login:
              <span class="font-bold">{{
                fictionUser.activeOrganization.value?.orgEmail
              }}</span>
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

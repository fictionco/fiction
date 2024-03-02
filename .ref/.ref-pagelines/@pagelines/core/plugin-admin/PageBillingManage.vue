<script lang="ts" setup>
import type {
  FactorUser,
  MenuItem,
} from '@factor/api'
import {
  standardDate,
  toLabel,
  useService,
  vue,
} from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { FactorStripe } from '@factor/plugin-stripe'
import type { CustomerDetails } from '@factor/plugin-stripe/types'
import AdminPageSettings from '../plugin-admin/AdminPageSettings.vue'

const { factorStripe, factorUser } = useService<{
  factorStripe: FactorStripe
  factorUser: FactorUser
}>()

const sending = vue.ref('')
const coupon = vue.ref()
vue.onMounted(async () => {
  await factorStripe.setCustomerData()
})

const activeCustomer = vue.computed(() => {
  return factorStripe.activeCustomer.value
})

vue.computed<MenuItem[]>(() => {
  const upgradeTier = activeCustomer.value?.upgradeTier

  const actions = []
  if (upgradeTier) {
    actions.push({
      name: `Upgrade To ${toLabel(upgradeTier?.group)} ($${
        upgradeTier?.cost
      }/mo)`,
      onClick: () => changePlan(upgradeTier),
      btn: 'primary',
      size: 'lg',
    })
  }

  return actions
})

async function changePlan(args: CustomerDetails) {
  const subscriptionId = factorStripe.activeCustomer.value?.subscriptionId

  if (subscriptionId) {
    const confirmed = confirm('Are you sure?')
    if (!confirmed)
      return
    const { quantity } = args
    sending.value = 'change'
    await factorStripe.requestManageSubscription('change', {
      priceId: args.priceId,
      subscriptionId,
      coupon: coupon.value,
      quantity,
    })

    await factorStripe.setCustomerData()
  }
  else {
    location.href = await factorStripe.getCheckoutUrl({
      priceId: args.priceId,
      loginPath: '/auth/login',
    })
  }

  sending.value = ''
}

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
//   await factorStripe.requestManageSubscription('cancel', {
//     priceId: args.priceId,
//     subscriptionId,
//   })

//   await factorStripe.setCustomerData()

//   sending.value = ''
// }
</script>

<template>
  <AdminPageSettings title="Manage Billing">
    <div class="space-y-6">
      <ElPanel title="Usage and Billing">
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
              v-if="factorStripe.usage.activeUsage.value"
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
                      {{
                        standardDate(
                          factorStripe.usage.activeUsage.value.cycleStartAtIso,
                        )
                      }}
                      to
                      {{
                        standardDate(
                          factorStripe.usage.activeUsage.value.cycleEndAtIso,
                        )
                      }}
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
                      {{ factorStripe.usage.activeUsage.value.usedCredits }} of
                      {{ factorStripe.usage.activeUsage.value.paidCredits }}
                      credits ({{
                        factorStripe.usage.activeUsage.value.percentUsed || 0
                      }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="bg-theme-50 my-2 p-4 text-xs font-semibold">
              No Data
            </div>
          </div>
          <div class="max-w-prose">
            <div class="font-bold">
              Billing Dashboard
            </div>
            <div class="text-slate-600">
              <p class="my-4">
                PageLines partners with Stripe to handle payments and billing.
                To view invoices, change plan or payment method, please visit
                the billing dashboard...
              </p>
              <p class="my-4">
                Use your billing email to login:
                <span class="font-bold">{{
                  factorUser.activeOrganization.value?.organizationEmail
                }}</span>
              </p>
            </div>
            <div class="mt-6">
              <ElButton
                :href="factorStripe.customerPortalUrl.value"
                btn="primary"
              >
                Billing Dashboard &rarr;
              </ElButton>
            </div>
          </div>
        </div>
      </ElPanel>
    </div>
  </AdminPageSettings>
</template>

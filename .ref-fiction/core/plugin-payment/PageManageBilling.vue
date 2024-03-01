<script lang="ts" setup>
import type { MenuItem } from '@factor/api'
import { groupBy, standardDate, toLabel, vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElInput from '@factor/ui/ElInput.vue'
import AdminPageSettings from '../plugin-admin/AdminPageSettings.vue'
import { useFictionApp } from '../util'
import { pricing } from '../stripe'
import ElPlanItem from './ElPlanItem.vue'
import type { CustomerDetails } from '.'

const { fictionPayment, factorStripe, fictionUsage } = useFictionApp()

const sending = vue.ref('')
const coupon = vue.ref()
const couponVis = vue.ref(false)
const showDowngrade = vue.ref(false)

vue.onMounted(async () => {
  await fictionPayment.setCustomerData()
})

const activeCustomer = vue.computed(() => {
  return fictionPayment.activeCustomer.value
})

const upgradeActions = vue.computed<MenuItem[]>(() => {
  const upgradeTier = activeCustomer.value?.upgradeTier
  // const upgradeQuantity = activeCustomer.value?.upgradeQuantity

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

const listUpgrade = vue.computed(() => {
  const quantity = activeCustomer.value?.quantity || 0
  const p = pricing
    .reverse()
    .filter(p => !activeCustomer.value || (p.quantity || 0) >= quantity)
    .map((p) => {
      const isCurrent = p.quantity === quantity

      return { ...p, isCurrent }
    })
  return groupBy<Record<string, CustomerDetails[]>>(p, 'group')
})

const listDowngrade = vue.computed(() => {
  const q = activeCustomer.value?.quantity || 0
  const p = pricing
    .reverse()
    .filter(p => activeCustomer.value && (p.quantity || 0) < q)

  return groupBy<Record<string, CustomerDetails[]>>(p, 'group')
})

async function changePlan(args: CustomerDetails) {
  const subscriptionId = fictionPayment.activeCustomer.value?.subscriptionId

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

    await fictionPayment.setCustomerData()
  }
  else {
    location.href = await factorStripe.getCheckoutUrl({ priceId: args.priceId })
  }

  sending.value = ''
}

async function cancelPlan(args?: CustomerDetails) {
  const subscriptionId = args?.subscriptionId

  if (!subscriptionId)
    throw new Error('no subscription id')

  const confirmed = confirm(
    'Are you sure? This will cancel your subscription, as remove access to your data and AI tools',
  )
  if (!confirmed)
    return
  sending.value = 'delete'
  await factorStripe.requestManageSubscription('cancel', {
    priceId: args.priceId,
    subscriptionId,
  })

  await fictionPayment.setCustomerData()

  sending.value = ''
}
</script>

<template>
  <AdminPageSettings title="Change Plan">
    <div class="space-y-6">
      <ElPanel>
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <div
              class="text-theme-400 mb-1 text-[10px] font-bold uppercase tracking-wide"
            >
              Current Plan
            </div>
            <div class="text-2xl font-extrabold">
              {{ activeCustomer?.planName }}
            </div>
            <div class="mt-4">
              <ElButton
                v-for="(item, i) in upgradeActions"
                :key="i"
                :href="item.href || item.link?.value"
                :btn="item.btn"
                @click.stop="item.onClick && item.onClick($event)"
              >
                {{ item.name }}
              </ElButton>
            </div>
          </div>
          <div class="col-span-8" />
        </div>

        <div class="my-4 flex items-center justify-end space-x-4">
          <div
            class="text-theme-300 hover:text-theme-500 cursor-pointer text-xs font-bold uppercase"
            @click="couponVis = !couponVis"
          >
            Add Code &darr;
          </div>
          <div v-if="couponVis">
            <ElInput
              v-model="coupon"
              input="InputText"
              placeholder="MY_CODE"
            />
            <div class="text-theme-400 max-w-[150px] text-[10px] italic">
              Any code you add here will be applied when upgrading.
            </div>
          </div>
        </div>
        <label
          v-if="activeCustomer?.isTrial"
          class="bg-theme-0 relative my-8 block cursor-pointer rounded-lg border px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between border-theme-300   text-theme-500 bg-theme-50 hover:bg-theme-100"
        >
          <span class="flex items-center">
            <span class="flex flex-col text-sm">
              <span
                id="server-size-0-label"
                class="space-x-2 text-lg font-extrabold capitalize"
              >
                <span class="font-extrabold">End Trial Early and Upgrade Now</span>
                <span class="opacity-50"> Access All Features </span>
              </span>
              <span
                id="server-size-0-description-0"
                class="space-x-2 opacity-50"
              >
                <span class="block sm:inline">End your trial early for full limits and access to all pro
                  features</span>
              </span>
            </span>
          </span>
          <span
            class="border-1 pointer-events-none absolute -inset-px rounded-lg"
            aria-hidden="true"
          />
        </label>
        <fieldset class="my-8 grid grid-cols-12 gap-4">
          <template v-for="(prices, group) in listUpgrade" :key="group">
            <ElPlanItem
              v-for="(p, i) in prices"
              :key="i"
              class="col-span-4"
              :price="p"
              @click.prevent="changePlan(p)"
            />
          </template>
        </fieldset>

        <div v-if="activeCustomer?.subscriptionId" class="downgrade">
          <a
            class="text-theme-400 cursor-pointer text-sm font-bold"
            @click.prevent="showDowngrade = !showDowngrade"
          >
            Downgrade Options &darr;
          </a>
          <template v-if="showDowngrade">
            <fieldset class="my-8 grid grid-cols-12 gap-4">
              <template v-for="(prices, group) in listDowngrade" :key="group">
                <ElPlanItem
                  v-for="(p, i) in prices"
                  :key="i"
                  class="col-span-4"
                  :price="p"
                  @click.prevent="changePlan(p)"
                />
              </template>
            </fieldset>

            <div class="my-12">
              <ElInput
                class="my-8"
                label="Cancel Subscription"
                sub-label="Cancel your subscription and remove access"
              >
                <div class="rounded-md pt-4">
                  <a
                    class="text-theme-400 cursor-pointer text-sm font-bold"
                    @click.prevent="cancelPlan(activeCustomer)"
                  >
                    Cancel Subscription &rarr;
                  </a>
                </div>
              </ElInput>
            </div>
          </template>
        </div>
      </ElPanel>
      <ElPanel title="Usage and Billing">
        <div class="grid grid-cols-1 gap-8 text-sm md:grid-cols-2">
          <div class="">
            <div class="font-bold">
              Service Usage
            </div>
            <div v-if="fictionUsage.activeUsage.value" class="mt-2 space-y-4">
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
                          fictionUsage.activeUsage.value.cycleStartAtIso,
                        )
                      }}
                      to
                      {{
                        standardDate(
                          fictionUsage.activeUsage.value.cycleEndAtIso,
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
                      Server Usage (minutes):
                    </div>
                    <div class="font-bold">
                      {{ fictionUsage.activeUsage.value.usedMinutes }} of
                      {{ fictionUsage.activeUsage.value.paidMinutes }} server
                      minutes ({{
                        fictionUsage.activeUsage.value.percentUsed
                      }}%)
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
                      <div class="i-heroicons-rectangle-stack text-xl" />
                    </span>
                  </div>
                  <div class=" ">
                    <div class="text-theme-500 text-xs">
                      Images Generated:
                    </div>
                    <div class="font-bold">
                      {{ fictionUsage.activeUsage.value.usedImages }} of
                      {{ fictionUsage.activeUsage.value.paidImages }} images
                    </div>
                  </div>
                  <div class=" ">
                    <div class="text-theme-500 text-xs">
                      Models Trained:
                    </div>
                    <div class="font-bold">
                      {{ fictionUsage.activeUsage.value.usedModels }} of
                      {{ fictionUsage.activeUsage.value.paidModels }} models
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
              Invoices and Detailed Billing
            </div>
            <div class="mt-2 text-slate-500">
              Fiction partners with Stripe to handle payments and billing. To
              view invoices, update your billing information, or change your
              payment method, please visit the billing dashboard,
            </div>
            <div class="mt-6">
              <ElButton
                href="https://billing.stripe.com/p/login/fZedS66gTaiegww7ss"
                btn="primary"
                size="sm"
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

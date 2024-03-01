<script lang="ts" setup>
import {
  emitEvent,
  formatNumber,
  log,
  stored,
  vue,
  vueRouter,
} from '@factor/api'

import type { CustomerData } from '@factor/plugin-stripe'
import { requestCreateSubscription } from '@factor/plugin-stripe'

import ElInput from '@factor/ui/ElInput.vue'
import InputText from '@factor/ui/InputText.vue'
import type { PaymentMethodCreateParams } from '@stripe/stripe-js'
import ElButton from '../ui/ElButton.vue'
import ElZeroState from '../ui/ElZeroState.vue'
import { useKaption } from '../utils'
import AdminPage from '../plugin-admin/AdminPage.vue'
import type { CardElements } from './types'
import ElemTrustBadge from './BillingElemTrustBadge.vue'
import ElemCreditCard from './BillingElemCreditCard.vue'

const { factorStripe, kaptionBilling } = useKaption()

interface VerifiedCode {
  name: string
  id: string
  duration: number
  percentDiscount: number
  amountOff: number
  valid: boolean
}
const router = vueRouter.useRouter()
const verifiedCode = vue.ref<undefined | VerifiedCode>()
const showCode = vue.ref(false)
const upgradeCode = vue.ref('')
const basePrice = vue.computed(() => {
  return 79
})
const usagePrice = vue.computed(() => {
  return 2
})

const sending = vue.ref<string | boolean>(false)
const upgradeSuccessful = vue.ref(false)
const customerData = vue.computed(() => stored<CustomerData>('customerData'))
const customerId = vue.computed(() => customerData.value?.customer?.id)
// const { priceId } =
//   factorStripe.getStripePrice({ productKey: "pro", priceKey: "month" }) ?? {}
const priceId = ''
const cardElements = vue.computed<Partial<CardElements>>(
  () => stored<Partial<CardElements>>('cardElements') ?? {},
)
async function createOrder(): Promise<void> {
  sending.value = 'upgrade'

  const els = cardElements.value

  try {
    if (!els.card?.cardNumber)
      throw new Error('no card number')
    if (!priceId)
      throw new Error('no price for product')

    const stripe = await factorStripe.getBrowserClient()

    const billing_details: PaymentMethodCreateParams.BillingDetails = {}

    if (els.email)
      billing_details.email = els.email
    if (els.name)
      billing_details.name = els.name
    if (els.zip)
      billing_details.address = { postal_code: els.zip }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: els.card.cardNumber,
      billing_details,
    })

    if (error) {
      emitEvent('formError', error)
      return
    }

    if (!paymentMethod?.id)
      throw new Error('payment method missing')

    if (!customerId.value)
      throw new Error('customer id is missing')

    const result = await requestCreateSubscription({
      customerId: customerId.value,
      paymentMethodId: paymentMethod?.id,
      priceId,
      coupon: verifiedCode.value?.id,
      factorStripe,
    })

    if (result.status === 'success') {
      upgradeSuccessful.value = true
      await router.replace({
        query: { ...router.currentRoute.value.query, trial: 1 },
      })
    }
  }
  catch (error: unknown) {
    const e = error as Error
    log.l({ level: 'error', description: 'create sub error', data: e })
    emitEvent('error', { message: e.message })
    sending.value = false
  }
}

async function addCode(): Promise<void> {
  sending.value = 'code'

  const result = await factorStripe.requests.GetCoupon.request({
    couponCode: upgradeCode.value,
  })

  const r = result.data

  if (result.status === 'success' && r && r.valid) {
    verifiedCode.value = {
      percentDiscount: r.percent_off ?? 0,
      amountOff: r.amount_off ?? 0,
      name: r.name ?? '',
      id: r.id,
      duration: r.duration_in_months ?? 0,
      valid: r.valid,
    }
    showCode.value = false
  }

  sending.value = false
}
</script>

<template>
  <AdminPage>
    <div class="m-auto max-w-prose">
      <div v-if="upgradeSuccessful || kaptionBilling.activeIsPro" class="">
        <ElZeroState
          title="You've Upgraded!"
          note="Wise Decision!  You are now collecting additional data and your new tools should be enabled."
        >
          <template #icon>
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </template>
          <template #action>
            <div class="my-4">
              <ElButton btn="primary" to="/">
                View Dashboard &rarr;
              </ElButton>
            </div>
          </template>
        </ElZeroState>
      </div>
      <div v-else class="mt-6 rounded-md border border-slate-200 p-7">
        <div>
          <div>
            <h3 class="text-xl font-bold leading-6">
              Upgrade to Pro
            </h3>
            <p class="text-theme-500 mt-1 max-w-2xl text-sm">
              Review details and upgrade below
            </p>
          </div>
          <div class="mt-5 border-t border-slate-200">
            <dl class="sm:divide-y sm:divide-slate-200">
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt class="text-sm font-medium">
                  Trial
                </dt>
                <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <span class="font-medium">14-day free trial.</span> Cancel
                  anytime.
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt class="text-sm font-medium">
                  Base Plan
                </dt>
                <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <span class="font-medium">{{ formatNumber(basePrice, "dollar") }} per month</span>
                  for 10k sessions (or 100k distinct events)
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt class="text-sm font-medium">
                  After 10k Sessions...
                </dt>
                <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <div class="text-theme-500 mb-4">
                    Pay as you go:
                  </div>

                  <span class="font-medium">{{ formatNumber(usagePrice, "dollar") }} per 1,000
                    sessions</span>
                  (or 10k distinct events)
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt class="text-sm font-medium">
                  Billing
                </dt>
                <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  Usage is tracked and billed monthly.
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt class="text-sm font-medium">
                  More
                </dt>
                <dd class="text-theme-500 mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <div>
                    <span class="text-theme-500"> Need a quick answer?</span>
                    <span>
                      Email us at
                      <a class="underline" href="mailto:hello@kaption.co">hello@kaption.co</a>.
                    </span>
                  </div>
                </dd>
              </div>
              <div
                v-if="verifiedCode"
                class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
              >
                <dt class="text-sm font-medium">
                  Code / Discount
                </dt>
                <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <div class="mb-2">
                    A code has been applied. The following will be added or
                    discounted to the base pricing above.
                  </div>
                  <div>
                    <div v-if="verifiedCode.name">
                      <span class="mr-2 font-medium">Name:</span>
                      <span>{{ verifiedCode.name }}</span>
                    </div>
                    <div>
                      <span class="mr-2 font-medium">Duration:</span>
                      <span v-if="verifiedCode.duration">{{ verifiedCode.duration }} Months</span>
                      <span v-else>Ongoing</span>
                    </div>
                    <div v-if="verifiedCode.percentDiscount">
                      <span class="mr-2 font-medium">Percent Off:</span>
                      <span>{{ verifiedCode.percentDiscount }}%</span>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
            <div class="relative mt-5 border-t border-slate-200">
              <div :class="sending ? 'opacity-50 pointer-events-none' : ''">
                <ElemCreditCard />

                <div v-if="showCode" class="coupon-code">
                  <ElInput
                    class=""
                    label="Add Code"
                    description="Have a code to associate with this trial? Add it here"
                  >
                    <div class="flex space-x-4">
                      <InputText v-model="upgradeCode" class="w-56" />
                      <ElButton
                        btn="default"
                        :loading="sending === 'code'"
                        @click="addCode()"
                      >
                        Add
                      </ElButton>
                    </div>
                  </ElInput>
                </div>
                <div class="flex items-center justify-between">
                  <ElButton
                    btn="primary"
                    :loading="sending === 'upgrade'"
                    @click="createOrder()"
                  >
                    Start Trial &rarr;
                  </ElButton>
                  <div>
                    <span
                      class="text-theme-300 hover:text-theme-600 cursor-pointer text-xs font-semibold uppercase tracking-wider"
                      @click="showCode = true"
                    >+ Code</span>
                  </div>
                </div>

                <ElemTrustBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminPage>
</template>

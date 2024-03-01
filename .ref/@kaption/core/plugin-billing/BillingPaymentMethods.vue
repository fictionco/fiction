<script lang="ts" setup>
import { dayjs, emitEvent, stored, vue } from '@factor/api'
import type { CustomerData } from '@factor/plugin-stripe'
import type { PaymentMethod, PaymentMethodCreateParams } from '@stripe/stripe-js'
import ElButton from '../ui/ElButton.vue'
import { useKaption } from '../utils'
import BillingWrap from './BillingWrap.vue'
import BillingElemCreditCard from './BillingElemCreditCard.vue'
import BillingElemTrustBadge from './BillingElemTrustBadge.vue'

import type { CardElements } from './types'

const { factorStripe } = useKaption()

const sending = vue.ref(false)
const customerData = vue.computed(() => stored<CustomerData>('customerData'))
const paymentMethods = vue.computed(
  () => customerData.value?.paymentMethods ?? [],
)
const cardElements = vue.computed<Partial<CardElements>>(
  () => stored<Partial<CardElements>>('cardElements') ?? {},
)

async function submitPaymentMethod(): Promise<PaymentMethod | undefined> {
  sending.value = true

  const els = cardElements.value

  if (!els.card?.cardNumber)
    throw new Error('no card number')

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

  if (error)
    emitEvent('formError', error)
  else
    return paymentMethod
}

async function addPaymentMethod(): Promise<void> {
  if (!customerData.value?.customer?.id)
    throw new Error('no customer id')

  sending.value = true
  const paymentMethod = await submitPaymentMethod()
  if (!paymentMethod?.id) {
    sending.value = false
    throw new Error('no payment method id')
  }

  await factorStripe.requests.ManagePaymentMethod.request({
    customerId: customerData.value?.customer.id,
    paymentMethodId: paymentMethod.id,
    _action: 'create',
  })

  emitEvent('resetForm')
  sending.value = false
}

async function deleteMethod(paymentMethodId: string): Promise<void> {
  if (!customerData.value?.customer?.id)
    throw new Error('no customer id')

  sending.value = true
  await factorStripe.requests.ManagePaymentMethod.request({
    customerId: customerData.value?.customer.id,
    paymentMethodId,
    _action: 'delete',
  })
  sending.value = false
}
</script>

<template>
  <BillingWrap>
    <div class="m-auto max-w-prose">
      <div class="my -12 rounded-md p-4 lg:px-6 lg:py-5">
        <div class="mb-4 text-lg font-semibold">
          Existing Payment Methods
        </div>

        <div
          v-if="paymentMethods.length === 0"
          class="my-4 rounded-md border border-slate-200 p-12 text-center"
        >
          <h2 class="font-semibold">
            No Payment Method Added
          </h2>
          <div class="text-theme-400">
            Add one below
          </div>
        </div>

        <div v-else>
          <div
            v-for="(pm, i) in paymentMethods"
            :key="i"
            class="relative my-2 rounded-md p-4 shadow-sm"
          >
            <h4 class="sr-only">
              {{ pm?.card?.brand }}
            </h4>
            <div class="sm:flex sm:items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <div class="mt-3 sm:mt-0 sm:ml-4">
                <div class="text-lg font-semibold">
                  Ending with
                  <span class="text-primary-700">{{ pm?.card?.last4 }}</span>
                </div>
                <div
                  class="text-theme-500 mt-1 text-sm sm:flex sm:items-center"
                >
                  <div>
                    Expires {{ pm?.card?.exp_month }}/{{ pm?.card?.exp_year }}
                  </div>
                  <span class="hidden sm:mx-2 sm:inline" aria-hidden="true">
                    &middot;
                  </span>
                  <div class="mt-1 sm:mt-0">
                    Created on
                    {{ dayjs.unix(pm.created).format("MMM DD, YYYY") }}
                  </div>
                </div>
              </div>
              <div
                class="text-theme-200 absolute top-4 right-4 cursor-pointer hover:text-red-500"
                @click="deleteMethod(pm.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 rounded-md p-4 lg:p-8">
        <div class="mb-4 text-lg font-semibold">
          Add Payment Method
        </div>

        <BillingElemCreditCard />

        <ElButton
          btn="primary"
          :loading="sending"
          @click="addPaymentMethod()"
        >
          Add Payment Method
        </ElButton>

        <BillingElemTrustBadge />
      </div>
    </div>
  </BillingWrap>
</template>

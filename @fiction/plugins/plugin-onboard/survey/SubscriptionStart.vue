<script setup lang="ts">
import type { ActionButton, EndpointResponse } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { TrialSetupResponse } from '@fiction/plugin-stripe/endpoints'
import type { Appearance, PaymentIntent, SetupIntent, Stripe, StripeElements } from '@stripe/stripe-js'
import { getColorScheme, isDarkOrLightMode, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { defineProps } from 'vue'

const { priceLookupKey, button, trialType = 'paid' } = defineProps<{ priceLookupKey: string, button?: ActionButton, trialType: 'free' | 'paid' }>()

const emit = defineEmits<{
  (event: 'complete', payload: EndpointResponse): void
  (event: 'error', payload: { message: string }): void
}>()

const { fictionStripe, fictionUser } = useService<{ fictionStripe: FictionStripe }>()

const loading = vue.ref(false)
const error = vue.ref('')
const elements = vue.ref<StripeElements>()
const stripe = vue.ref<Stripe>()
const paymentElementRef = vue.ref()
const paymentElement = vue.ref<any>()
const setupResponse = vue.ref<TrialSetupResponse>()

// Friendly error messages map
const errorMessages = {
  default: 'An unexpected error occurred. Please try again.',
  setup_failed: 'Payment method setup failed. Please check your card details.',
  incomplete_setup: 'Payment method setup incomplete. Please check your card details.',
  payment_failed: 'Payment processing failed. Please try another payment method.',
  user_not_found: 'Please sign in to continue.',
  initialization_failed: 'Payment system initialization failed. Please refresh the page.',
}

function getFriendlyError(err: unknown): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase()
    if (message.includes('user'))
      return errorMessages.user_not_found
    if (message.includes('setup'))
      return errorMessages.setup_failed
    if (message.includes('payment'))
      return errorMessages.payment_failed
    if (message.includes('initialize'))
      return errorMessages.initialization_failed
  }
  return errorMessages.default
}

function getThemeConfig() {
  const mode = isDarkOrLightMode()
  const appearance: Appearance = {
    theme: mode === 'dark' ? 'night' : 'stripe',
    variables: {
    },
  }
  return appearance
}

async function handlePayment() {
  if (!stripe.value || !elements.value || !setupResponse.value) {
    error.value = errorMessages.initialization_failed
    return
  }

  loading.value = true
  error.value = ''

  try {
    let intentId: string | undefined
    const isFreeTrial = trialType === 'free'

    const handleResult = isFreeTrial
      ? await stripe.value.confirmSetup({
        elements: elements.value,
        redirect: 'if_required',
        confirmParams: { return_url: window.location.href },
      })
      : await stripe.value.confirmPayment({
        elements: elements.value,
        redirect: 'if_required',
        confirmParams: { return_url: window.location.href },
      })

    const intent = (isFreeTrial
      ? (handleResult as { setupIntent?: SetupIntent }).setupIntent
      : (handleResult as { paymentIntent?: PaymentIntent }).paymentIntent)

    if (!intent || intent.status !== 'succeeded') {
      throw new Error(isFreeTrial ? 'Setup failed' : 'Payment failed')
    }

    const response = await fictionStripe.requests.StripeTrial.projectRequest({
      _action: 'completeSetup',
      setupIntentId: isFreeTrial ? intent.id : undefined,
      paymentIntentId: !isFreeTrial ? intent.id : undefined,
      priceLookupKey,
    })

    if (response.status === 'error')
      throw new Error(response.message)
    emit('complete', response)
  }
  catch (err) {
    error.value = getFriendlyError(err)
    emit('error', { message: error.value })
  }
  finally {
    loading.value = false
  }
}

async function setupStripe() {
  loading.value = true
  error.value = ''

  try {
    const user = await fictionUser.userInitialized()
    if (!user?.email)
      throw new Error('User not found')

    const response = await fictionStripe.requests.StripeTrial.projectRequest({
      _action: 'setupTrial',
      priceLookupKey,
      email: user.email,
      trialType,
    })

    if (!response.data?.clientSecret)
      throw new Error('Initialization failed')
    setupResponse.value = response.data

    stripe.value = await fictionStripe.getBrowserClient()
    elements.value = stripe.value.elements({
      clientSecret: response.data.clientSecret,
      appearance: getThemeConfig(),
    })

    paymentElement.value = elements.value.create('payment', { layout: 'tabs' })
    paymentElement.value.mount(paymentElementRef.value)
  }
  catch (err) {
    error.value = getFriendlyError(err)
    emit('error', { message: error.value })
  }
  finally {
    loading.value = false
  }
}

vue.watch(
  () => isDarkOrLightMode(),
  () => {
    if (elements.value) {
      elements.value.update({ appearance: getThemeConfig() })
    }
  },
)

vue.onMounted(() => {
  setupStripe()
})

vue.onBeforeUnmount(() => {
  if (paymentElement.value) {
    paymentElement.value.unmount()
  }
})
</script>

<template>
  <div class="relative min-h-[400px] max-w-lg mx-auto space-y-12">
    <div
      v-if="loading"
      class="absolute z-10 inset-0 py-12 flex justify-center items-center bg-white/80 dark:bg-black/80"
    >
      <ElSpinner class="w-6 text-theme-400 dark:text-theme-600" />
    </div>

    <div
      v-if="error"
      class="p-3 text-rose-600 dark:text-rose-100 dark:bg-rose-900/50 bg-rose-50 rounded-lg text-sm"
      role="alert"
    >
      {{ error }}
    </div>

    <div ref="paymentElementRef" class="min-h-[300px]" />

    <div class="flex justify-center">
      <XButton
        v-if="elements"
        :theme="button?.theme || 'primary'"
        display="block"
        :loading="loading"
        :size="button?.size || 'lg'"
        :icon="button?.icon"
        @click="handlePayment"
      >
        {{ button?.label || 'Start Trial' }}
      </XButton>
    </div>
  </div>
</template>

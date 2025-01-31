<script setup lang="ts">
import type { ActionButton, EndpointResponse } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { TrialSetupResponse } from '@fiction/plugin-stripe/endpointTrial'
import type { Card } from '@fiction/site'
import type { Appearance, Stripe, StripeElements } from '@stripe/stripe-js'
import { isDarkOrLightMode, log, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const {
  priceLookupKey,
  button,
  trialType = 'paid',
} = defineProps<{ priceLookupKey: string, button?: ActionButton, trialType: 'free' | 'paid', card: Card }>()

const emit = defineEmits<{
  (event: 'complete', payload: EndpointResponse): void
  (event: 'error', payload: { message: string }): void
}>()

const logger = log.contextLogger('SubscriptionStart')

const { fictionStripe, fictionUser } = useService<{ fictionStripe: FictionStripe }>()

const loading = vue.ref(true)
const sending = vue.ref(false)
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
  payment_failed: 'Card verification failed. Please try another card.',
  user_not_found: 'Please sign in to continue.',
  initialization_failed: 'Payment system initialization failed. Please refresh the page.',
  verification_failed: 'Unable to verify your card. Check that it\'s active and has funds available.',
  network_error: 'Network connection issue. Please check your connection and try again.',
}

function getFriendlyError(err: unknown): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase()

    if (message.includes('network'))
      return errorMessages.network_error
    if (message.includes('verification'))
      return errorMessages.verification_failed
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

    const data = response.data || {}

    if (!data?.paymentIntentClientSecret)
      throw new Error('Initialization failed')

    setupResponse.value = response.data

    stripe.value = await fictionStripe.getBrowserClient()
    elements.value = stripe.value.elements({
      clientSecret: data?.paymentIntentClientSecret,
      appearance: getThemeConfig(),
    })

    paymentElement.value = elements.value.create('payment', { layout: 'tabs' })
    paymentElement.value.mount(paymentElementRef.value)
  }
  catch (err) {
    logger.info('setupStripe error', { error: err })
    error.value = getFriendlyError(err)
    emit('error', { message: error.value })
  }
  finally {
    loading.value = false
  }
}

async function handlePayment() {
  if (!stripe.value || !elements.value || !setupResponse.value) {
    error.value = errorMessages.initialization_failed
    return
  }

  sending.value = true
  error.value = ''

  try {
    const handleResult = await stripe.value.confirmPayment({
      elements: elements.value,
      redirect: 'if_required',
      confirmParams: { return_url: window.location.href },
    })

    const intent = handleResult.paymentIntent

    if (!intent || !['requires_capture', 'succeeded'].includes(intent.status)) {
      throw new Error('Payment verification failed')
    }

    const response = await fictionStripe.requests.StripeTrial.projectRequest({
      _action: 'completeSetup',
      priceLookupKey,
      ...setupResponse.value,
    })

    if (response.status === 'error')
      throw new Error(response.message)

    await fictionStripe.customerState.refresh()

    emit('complete', response)
  }
  catch (err) {
    logger.info('handlePayment error', { error: err })
    error.value = getFriendlyError(err)
    emit('error', { message: error.value })
  }
  finally {
    sending.value = false
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

vue.onMounted(async () => {
  await fictionUser.userInitialized()
  await fictionStripe.customerState.initialize({ caller: 'SubscriptionStart' })

  await setupStripe()

  loading.value = false
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
      v-if="!loading && fictionStripe.customerState.data.value?.isActive"
      class="text-balance text-sm text-orange-600 dark:text-orange-100 bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg text-left md:text-center"
    >
      You are already subscribed to a plan.
      Please contact support for assistance.
    </div>

    <div
      v-if="loading"
      class="w-full p-12 flex justify-center items-center min-h-[300px] inset-0 absolute"
    >
      <ElSpinner class="w-8 text-theme-400 dark:text-theme-600" />
    </div>

    <div
      v-if="error"
      class="p-3 text-rose-600 dark:text-rose-100 dark:bg-rose-900/50 bg-rose-50 rounded-lg text-sm"
      role="alert"
    >
      {{ error }}
    </div>

    <div ref="paymentElementRef" class="min-h-[300px]" />

    <div class="flex justify-center transition-all" :class="loading ? 'opacity-0' : 'opacity-100'">
      <XButton
        v-if="elements"
        :theme="button?.theme || 'primary'"
        display="block"
        :loading="sending"
        :size="button?.size || 'lg'"
        :icon="button?.icon"
        data-test-id="payment-submit-button"
        @click="handlePayment"
      >
        {{ button?.label || 'Start Trial' }}
      </XButton>
    </div>
  </div>
</template>

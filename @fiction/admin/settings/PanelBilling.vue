<script lang="ts" setup>
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { Card } from '@fiction/site'
import { standardDate, useService, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import SettingsPanel from './SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
const { fictionStripe } = useService<{ fictionStripe?: FictionStripe }>()

const activeCustomer = vue.computed(() => fictionStripe?.customerState.data.value)
const customerPortalUrl = vue.ref('')
const isLoading = vue.ref(true)
const errorMessage = vue.ref('')

const header = vue.computed(() => {
  const planName = activeCustomer.value?.plan || 'No Active Plan'
  return {
    title: `Subscription: ${planName}`,
    subTitle: 'Manage your subscription, payment methods, and billing history',
    media: { class: 'i-tabler-credit-card' },
    actions: [],
  }
})

async function setPortalUrl() {
  if (!activeCustomer.value) {
    errorMessage.value = 'Unable to load customer information. Please try again later.'
    return
  }

  try {
    const response = await fictionStripe?.requests.PortalSession.projectRequest({
      returnUrl: window.location.href,
    })

    if (response?.status === 'success' && response.data?.url) {
      customerPortalUrl.value = response.data.url
      errorMessage.value = ''
    }
    else {
      throw new Error('Failed to get portal URL')
    }
  }
  catch (error) {
    console.error('Portal URL Error:', error)
    errorMessage.value = 'Unable to access billing portal. Please try again later.'
  }
}

function formatDateRange(start?: string, end?: string): string {
  if (!start || !end)
    return 'Not available'
  return `${standardDate(start)} - ${standardDate(end)}`
}

const billingOptions = [
  new InputOption({
    label: 'Manage Subscription',
    subLabel: 'Securely manage your payment methods and billing details',
    input: 'InputControl',
    valueDisplay: () => ({
      status: 'ready',
      data: 'Access Stripe Secure Portal',
    }),
    actions: () => [
      {
        testId: 'billing-portal-access',
        label: 'Open Billing Portal',
        href: customerPortalUrl.value,
        theme: 'primary',
        icon: { class: 'i-tabler-credit-card' },
        disabled: !customerPortalUrl.value,
      },
    ],
  }),
  new InputOption({
    label: 'Billing Period',
    subLabel: 'Your current billing cycle information',
    input: 'InputControl',
    valueDisplay: () => {
      const customer = fictionStripe?.activeCustomer.value
      return {
        status: 'ready',
        data: `Current Period: ${formatDateRange(
          customer?.cycleStartAtIso,
          customer?.cycleEndAtIso,
        )}`,
      }
    },
    actions: () => [],
  }),
]

const options = vue.computed(() => [
  new InputOption({
    key: 'billing',
    label: 'Subscription Details',
    input: 'group',
    options: billingOptions,
    format: 'control',
  }),
])

vue.onMounted(async () => {
  try {
    await fictionStripe?.customerInitialized({ caller: 'PanelBilling' })
    await setPortalUrl()
  }
  catch (error) {
    console.error('Initialization Error:', error)
    errorMessage.value = 'Unable to load billing information. Please refresh the page.'
  }
  finally {
    isLoading.value = false
  }
})
</script>

<template>
  <SettingsPanel
    title="Billing and Usage"
    :header
  >
    <FormEngine
      :model-value="{}"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      @update:model-value="() => {}"
    />
  </SettingsPanel>
</template>

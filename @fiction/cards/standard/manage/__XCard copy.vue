<script lang="ts" setup>
import type { ActionButton, NavListItem, SyndicateStatus } from '@fiction/core'
import type { CardbackQueryVars } from '@fiction/core/plugin-email/vars'
import type { Card } from '@fiction/site/card'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { createOption } from '@fiction/ui/inputs/index.js'
import CardWrap from '../../CardWrap.vue'

defineOptions({ name: 'ContactTransaction' })

const props = defineProps<{
  card: Card
}>()

const loading = vue.ref(true)
const contact = vue.ref()
const formData = vue.ref<{ status?: SyndicateStatus, password?: string }>({})

const site = vue.computed(() => props.card.site!)
const query = vue.computed(() => site.value.siteRouter.query.value as CardbackQueryVars)

type ConfigType = {
  title: string
  message: string
  autoRedirect: boolean
  options?: ReturnType<typeof createOption>[]
}

const config = vue.computed(() => {
  const { action } = query.value

  const configs: Record<string, ConfigType> = {
    verifySubscribe: {
      title: 'Subscription Verified',
      message: 'Your subscription has been confirmed',
      autoRedirect: true,
    },
    unsubscribe: {
      title: 'Manage Subscription',
      message: 'Update your subscription preferences',
      autoRedirect: false,
      options: [
        createOption({
          key: 'status',
          input: 'InputSelect',
          label: 'Subscription Status',
          list: [
            { value: 'active', label: 'Subscribed' },
            { value: 'unsubscribed', label: 'Unsubscribed' },
            { value: 'bounced', label: 'Bounced' },
          ] as NavListItem[],
        }),
      ],
    },
    changePassword: {
      title: 'Change Password',
      message: 'Create a new password for your account',
      autoRedirect: false,
      options: [
        createOption({
          key: 'password',
          input: 'InputPassword',
          label: 'New Password',
          isRequired: true,
        }),
      ],
    },
  }

  return configs[action as keyof typeof configs] || configs.verifySubscribe
})

const message = vue.computed(() => {
  if (loading.value)
    return 'Processing...'
  return contact.value ? config.value.message : 'Request failed'
})

const success = vue.computed(() => !loading.value && contact.value)

const buttons = vue.computed((): ActionButton[] => {
  const redirect = query.value.redirect

  if (!contact.value) {
    return redirect ? [{ label: 'Continue', href: redirect, theme: 'primary' }] : []
  }

  return [
    { label: 'Update', theme: 'primary', onClick: () => handleUpdate() },
    ...(redirect ? [{ label: 'Cancel', href: redirect }] : []),
  ]
})

async function loadContact() {
  const { targetOrgId, userId } = query.value
  if (!targetOrgId || !userId)
    return null

  const api = site.value.fictionSites.settings.fictionContact?.requests.ManageContact
  const response = await api?.request({ _action: 'current', targetOrgId, userId })

  return response?.data?.[0]
}

async function updateContact(fields: Record<string, any>) {
  const { targetOrgId, userId } = query.value
  if (!targetOrgId || !userId)
    return

  const api = site.value.fictionSites.settings.fictionContact?.requests.ManageContact
  return api?.request({ _action: 'current', targetOrgId, userId, fields })
}

async function handleUpdate() {
  await updateContact(formData.value)

  const redirect = query.value.redirect
  if (redirect && typeof window !== 'undefined') {
    window.location.href = redirect
  }
}

async function processAction() {
  const { action } = query.value

  if (action === 'verifySubscribe') {
    await updateContact({ status: 'active' })
  }

  const redirect = query.value.redirect
  if (config.value.autoRedirect && redirect && typeof window !== 'undefined') {
    setTimeout(() => window.location.href = redirect, 1500)
  }
}

vue.onMounted(async () => {
  try {
    contact.value = await loadContact()

    if (contact.value) {
      formData.value = { status: contact.value.status }
      await processAction()
    }
  }
  catch {}

  loading.value = false
})
</script>

<template>
  <CardWrap content-width="full" :card>
    <div
      class="min-h-[50vh] flex items-center justify-center p-8"
      data-test-id="transaction-container"
    >
      <div class="max-w-md text-center space-y-8">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="w-6 h-6 border-2 border-theme-300 border-t-primary-600 rounded-full animate-spin mx-auto"
          data-test-id="loading-spinner"
        />

        <!-- Result State -->
        <template v-else>
          <!-- Status Indicator -->
          <div data-test-id="transaction-status">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              :class="success ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'"
              :data-test-id="success ? 'success-indicator' : 'error-indicator'"
            >
              <div class="w-6 h-6" :class="success ? 'i-tabler-check' : 'i-tabler-x'" />
            </div>

            <h1 class="text-xl font-medium mb-2" data-test-id="transaction-title">
              {{ config.title }}
            </h1>

            <p class="text-theme-600 dark:text-theme-400" data-test-id="transaction-message">
              {{ message }}
            </p>
          </div>

          <!-- Form Options -->
          <div
            v-if="contact && config.options"
            data-test-id="transaction-form"
          >
            <FormEngine
              :model-value="formData"
              :options="config.options"
              :buttons="buttons"
              ui-size="md"
              format="input"
              @update:model-value="formData = $event"
            />
          </div>

          <!-- Action Buttons (non-form) -->
          <div v-else-if="buttons.length" class="flex justify-center gap-3">
            <XButton
              v-for="button in buttons"
              :key="button.label"
              :href="button.href"
              :theme="button.theme || 'default'"
              size="md"
              :data-test-id="button.href ? 'continue-button' : 'update-button'"
              @click="button.onClick?.({ event: $event, item: button })"
            >
              {{ button.label }}
            </XButton>
          </div>
        </template>
      </div>
    </div>
  </CardWrap>
</template>

<script lang="ts" setup>
import type { NavListItem, SyndicateStatus, vue } from '@fiction/core'
import type { CardbackQueryVars } from '@fiction/core/plugin-email/vars'
import type { Card } from '@fiction/site/card'
import { useService } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { computed, onMounted, ref } from 'vue'
import CardWrap from '../../CardWrap.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()

const loading = ref(true)
const contact = ref()
const status = ref<SyndicateStatus>('active')

const site = computed(() => props.card.site!)
const query = computed(() => site.value.siteRouter.query.value as CardbackQueryVars)

type ActionConfig = {
  title: string
  message: string
  icon: string
  iconClass: string
  autoAction?: (() => Promise<void>) | null
  showOptions?: boolean
}

const actionConfig: Record<string, ActionConfig> = {
  verifySubscribe: {
    title: 'Subscription Verified',
    message: 'Your subscription has been confirmed',
    icon: 'i-tabler-check',
    iconClass: 'bg-green-900/30 text-green-300',
    autoAction: () => updateContact('active'),
    showOptions: false,
  },
  unsubscribeOneClick: {
    title: 'Unsubscribed Successfully',
    message: 'You have been unsubscribed from our newsletter',
    icon: 'i-tabler-check',
    iconClass: 'bg-green-900/30 text-green-300',
    autoAction: () => updateContact('unsubscribed'),
    showOptions: false,
  },
  manage: {
    title: 'Manage Subscription',
    message: 'Update your subscription preferences',
    icon: 'i-tabler-settings',
    iconClass: 'bg-blue-900/30 text-blue-300',
    autoAction: null,
    showOptions: true,
  },
  noContact: {
    title: 'Contact Not Found',
    message: 'We could not find your subscription',
    icon: 'i-tabler-x',
    iconClass: 'bg-rose-900/30 text-rose-300',
    showOptions: false,
  },
} as const

const statusOptions: NavListItem[] = [
  { value: 'active', label: 'Subscribed' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'bounced', label: 'Bounced' },
]

const currentAction = computed(() => {
  if (query.value.action === 'verifySubscribe')
    return 'verifySubscribe'
  if (query.value.action === 'unsubscribeOneClick')
    return 'unsubscribeOneClick'
  return 'manage'
})

const config = computed(() => {
  if (!contact.value) {
    return actionConfig.noContact
  }
  return actionConfig[currentAction.value]
})

function api() {
  return site.value.fictionSites.settings.fictionContact?.requests.ManageContact
}

async function loginUser() {
  const { token, code } = query.value
  if (!token)
    return

  const userService = site.value.fictionSites.settings.fictionUser
  const response = await userService?.requests.ManageUser.request({
    _action: 'getUserWithToken',
    token,
    code,
  })

  if (response?.status === 'success' && response.data) {
    await userService?.setCurrentUser({
      user: response.data,
      token,
      reason: 'contactTransaction',
    })
  }
}

async function loadContact() {
  const { targetOrgId, userId } = query.value
  if (!targetOrgId || !userId) {
    contact.value = null
    return
  }

  const response = await api()?.request({
    _action: 'current',
    targetOrgId,
    userId,
  })

  contact.value = response?.data?.[0]
  status.value = contact.value?.status || 'active'
}

async function updateContact(newStatus: SyndicateStatus) {
  const { targetOrgId, userId } = query.value
  if (!contact.value || !targetOrgId || !userId) {
    throw new Error('Missing required contact information')
  }

  await api()?.request({
    _action: 'current',
    targetOrgId,
    userId,
    fields: { status: newStatus },
  })

  await loadContact()
}

async function handleStatusChange(newStatus: SyndicateStatus) {
  await updateContact(newStatus)
  status.value = newStatus
}

async function processAction() {
  const actionHandler = config.value.autoAction
  if (actionHandler) {
    await actionHandler()
  }
}

function redirectIfNeeded() {
  const redirect = query.value.redirect
  if (redirect && typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = redirect
    }, 2000) // 2 second delay for user to see confirmation
  }
}

onMounted(async () => {
  try {
    await loginUser()
    await loadContact()
    await processAction()
    redirectIfNeeded()
  }
  catch (error) {
    console.error('Contact transaction error:', error)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <CardWrap content-width="full" :card>
    <div class="min-h-[50vh] flex items-center justify-center p-8">
      <div class="max-w-sm text-center space-y-8">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="w-6 h-6 border-2 border-theme-300 border-t-primary-600 rounded-full animate-spin mx-auto"
        />

        <!-- Content State -->
        <template v-else>
          <div>
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              :class="config.iconClass"
            >
              <div class="w-6 h-6" :class="config.icon" />
            </div>
            <h1 class="text-xl font-medium">
              {{ config.title }}
            </h1>
            <p class="text-theme-400 mt-2">
              {{ config.message }}
            </p>
          </div>

          <!-- Subscription Management Options -->
          <div v-if="config.showOptions && contact">
            <ElInput
              input="InputSelect"
              :model-value="status"
              :list="statusOptions"
              label="Subscription Status"
              @update:model-value="handleStatusChange"
            />
          </div>
        </template>
      </div>
    </div>
  </CardWrap>
</template>

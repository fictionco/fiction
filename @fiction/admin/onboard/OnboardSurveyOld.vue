<script lang="ts" setup>
import type { EndpointResponse, FictionUser, StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import { useService, vue } from '@fiction/core'

import { AutosaveUtility } from '@fiction/core/utils/save'
import ElSubscriberStart from '@fiction/plugin-stripe/SubscriptionStart.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { localMedia } from '@fiction/ui/stock/localMedia'

const { card } = defineProps<{ card: Card }>()

const { fictionUser } = useService<{ fictionUser: FictionUser }>()

const TRIAL_PRODUCT = 'standard_month'
const TRIAL_PRICE = 29
const TRIAL_DAYS = 10

const form = vue.ref<{
  fullName?: string
  orgName?: string
  role?: string
  roleOther?: string
  goal?: string
  goalOther?: string
  needsOnboarding?: boolean
}>({ needsOnboarding: true })

// Load initial data
async function loadInitialData() {
  // Wait for user data to be available
  const user = await fictionUser.userInitialized({ caller: 'Onboard: Load Initial Data' })

  if (!user) {
    await card.goto('/auth', { isRedirect: true, caller: 'Onboard: Not Logged In' })
    return
  }

  const { activeOrganization } = fictionUser

  const org = activeOrganization.value

  if (user) {
    form.value = {
      ...form.value,
      fullName: user.fullName,
      ...user.onboard,
      needsOnboarding: user.needsOnboarding ?? true,
    }
  }

  if (org) {
    form.value = {
      ...form.value,
      orgName: org.orgName || user?.fullName,
      ...org.onboard,
    }
  }
}

// Load data on mount
vue.onMounted(() => {
  loadInitialData()

  vue.watch(() => form.value.fullName, (newName) => {
    if (newName && !form.value.orgName) {
      form.value.orgName = newName
    }
  }, { immediate: true })
})

// Save function to update both user and org records
async function save(): Promise<EndpointResponse> {
  const { orgId } = fictionUser.activeOrganization.value || {}
  if (!orgId)
    return { status: 'error' }

  try {
    const { role, roleOther, goal, goalOther, fullName, orgName, needsOnboarding } = form.value
    // Save org settings
    await fictionUser.requests.ManageOrganization.projectRequest({
      _action: 'update',
      where: { orgId },
      fields: { orgName, needsOnboarding, onboard: { role, roleOther, goal, goalOther } },
    }, { disableNotify: true })

    // Save user settings
    await fictionUser.requests.ManageUser.projectRequest({
      _action: 'updateCurrentUser',
      fields: { fullName, needsOnboarding, onboard: { role, roleOther, goal, goalOther } },
    }, { disableNotify: true })
    return { status: 'success' }
  }
  catch (error) {
    console.error('Error saving onboarding data:', error)
    return { status: 'error' }
  }
}
const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

// Watch for form changes and trigger autosave
vue.watch(() => ({ ...form.value }), () => {
  saveUtil.autosave({ caller: 'watchForm' })
}, { deep: true })

const firstName = vue.computed(() =>
  form.value.fullName?.replace(/^(Dr|Mr|Mrs|Ms|Prof)\.\s+/i, '').split(' ')[0] || '',
)

const goals = [
  { label: 'Get More Customers', description: 'Connect with your ideal clients and unlock new opportunities', value: 'leads' },
  { label: 'Share My Work', description: 'Create a stunning portfolio that showcases your best work', value: 'portfolio' },
  { label: 'Grow My Audience', description: 'Build a loyal following that loves what you do', value: 'audience' },
  { label: 'Launch Digital Products', description: 'Turn your expertise into scalable digital offerings', value: 'sales' },
  { label: 'Build Authority', description: 'Become the go-to expert in your field', value: 'reputation' },
  { label: 'Level Up My Career', description: 'Create a standout professional presence', value: 'personal' },
  { label: 'Start Creating Content', description: 'Share your insights and build meaningful connections', value: 'content' },
  { label: 'Get More Visibility', description: 'Be discovered for speaking and press opportunities', value: 'speaking' },
  { label: 'Something Else', description: 'Tell us about your unique vision', value: 'other' },
]

const roles = [
  { label: 'Creator', description: 'I make content that moves people', value: 'creator' },
  { label: 'Founder', description: 'I\'m building something meaningful', value: 'founder' },
  { label: 'Professional', description: 'I want to stand out in my field', value: 'professional' },
  { label: 'Consultant', description: 'I help others achieve results', value: 'consultant' },
  { label: 'Expert', description: 'I share specialized knowledge', value: 'expert' },
  { label: 'Other', description: 'Tell us about your unique path', value: 'other' },
]

const stepConfig: StepConfig = {
  onComplete: async () => {

  },
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        superTitle: {
          text: 'Welcome to Fiction',
          icon: { class: 'i-tabler-north-star' },
        },
        title: 'First, what\'s your full name?',
        subTitle: `${firstName.value ? `Hi ${firstName.value}! ` : ``}We're excited to help you build something!`,
        key: 'fullName',
        class: 'max-w-md',
        allowSkip: false,
      },
      {
        superTitle: {
          text: 'Identity',
          icon: { class: 'i-tabler-brush' },
        },
        title: 'What\'s your workspace name?',
        subTitle: 'This is also your brand name',
        key: 'orgName',
        class: 'max-w-md',
        allowSkip: false,
      },
      {
        superTitle: {
          text: 'Vision',
          icon: { class: 'i-tabler-target' },
        },
        title: 'What do you want to achieve?',
        subTitle: 'We\'ll optimize your experience for this',
        key: 'goal',
        class: 'max-w-md',
        allowSkip: false,
      },
      {
        superTitle: {
          text: 'Personalize',
          icon: { class: 'i-tabler-user' },
        },
        title: 'Which best describes you?',
        subTitle: 'Help us tailor your tools',
        key: 'role',
        class: 'max-w-md',
        allowSkip: true,
      },
      {
        key: 'payment',
        superTitle: {
          text: 'The #1 personal branding platform',
          theme: 'green',
          icon: { class: 'i-tabler-sparkles' },
        },
        title: 'Invest in Your Personal Brand',
        subTitle: `Free for ${TRIAL_DAYS} days then $${TRIAL_PRICE}/mo. Cancel anytime.`,
        button: {
          label: 'Start My Trial',
          theme: 'primary',
          size: 'lg',
          icon: 'i-tabler-bolt',
          iconAfter: 'i-tabler-arrow-right',
        },
        class: 'max-w-screen-xl',
        noButton: true,
      },
      {
        key: 'ready',
        superTitle: {
          text: 'Ready',
          theme: 'green',
          icon: { class: 'i-tabler-bolt' },
        },
        title: `You\'re All Set${firstName.value ? ` ${firstName.value}` : ``}!`,
        subTitle: 'An incredible future awaits. Let\'s begin...',
        button: {
          label: 'Go to Dashboard',
          theme: 'primary',
          size: 'lg',
          icon: 'i-tabler-bolt',
          iconAfter: 'i-tabler-arrow-right',
        },
        class: 'max-w-lg',
        onClick: async () => {
          form.value.needsOnboarding = false
          const r = await saveUtil.forceSync()

          if (r?.status === 'success') {
            await card.goto('/?onboarded=true')
          }
        },
      },
    ]

    return out
  }),
}
</script>

<template>
  <div
    class="onboarding-survey-veil text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-975 via-black to-theme-975"
  >
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class=" text-white absolute py-4 md:py-8 px-4 md:px-16 w-full flex justify-between">
        <XMedia class="h-[35px]" :media="localMedia.fictionIconInline" />
        <ElSavingSignal change-type="publish" :is-dirty="saveUtil.isDirty.value" />
      </div>
      <div
        class="flex min-h-full flex-col items-center justify-center p-4  sm:items-center sm:p-0"
      >
        <ElStepNav
          v-slot="{ step, changeStep }"
          :step-config="stepConfig"
          data-test-id="createSiteModal"
        >
          <div v-if="step.key === 'fullName'">
            <ElInput
              v-model="form.fullName"
              input="InputText"
              placeholder="Your full name"
              ui-size="lg"
              required
              :input-props="{ autofocus: true }"
            />
          </div>
          <div v-if="step.key === 'orgName'">
            <ElInput
              v-model="form.orgName"
              input="InputText"
              placeholder="Enter brand name"
              ui-size="lg"
              required
              :input-props="{ autofocus: true }"
            />
          </div>
          <div v-if="step.key === 'goal'" class="space-y-4">
            <ElInput
              v-model="form.goal"
              input="InputRadio"
              :list="goals"
              ui-size="lg"
              required
              @update:model-value="val => {
                if (val && val !== 'other') {
                  vue.nextTick(() => changeStep({ dir: 'next', needsValidation: false }))
                }
              }"
            />
            <ElInput
              v-if="form.goal === 'other'"
              v-model="form.goalOther"
              input="InputTextarea"
              :input-props="{ rows: 2 }"
              ui-size="lg"
              required
              placeholder="Tell us more about your goals"
            />
          </div>
          <div v-if="step.key === 'role'" class="space-y-4">
            <ElInput
              v-model="form.role"
              input="InputRadio"
              :list="roles"
              ui-size="lg"
              required
              @update:model-value="val => {
                if (val && val !== 'other') {
                  vue.nextTick(() => changeStep({ dir: 'next', needsValidation: false }))
                }
              }"
            />
            <ElInput
              v-if="form.role === 'other'"
              v-model="form.roleOther"
              input="InputTextarea"
              :input-props="{ rows: 2 }"
              ui-size="lg"
              placeholder="Tell us more about your situation"
              required
            />
          </div>
          <!-- Step 3: Payment -->
          <div v-else-if="step.key === 'payment'" class="w-full mx-auto">
            <div class="flex gap-8 justify-center">
              <div class="space-y-6 max-w-[500px] w-full">
                <ElSubscriberStart
                  :card
                  :price-lookup-key="TRIAL_PRODUCT"
                  trial-type="paid"
                  :button="step.button || {}"
                  class="w-full"
                  @complete="changeStep({ step: 'ready' })"
                />
                <div class="text-xs text-theme-500 mt-4 text-center">
                  Secure encryption • Cancel anytime • 24/7 support
                </div>

                <div class="flex justify-center">
                  <XButton
                    size="sm"
                    design="link"
                    theme="default"
                    :data-test-id="`skip-button-${step.key}`"
                    @click="changeStep({ step: 'ready' })"
                  >
                    Maybe Later
                  </XButton>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="step.key === 'ready'" />
        </ElStepNav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'

import ElInput from '@fiction/ui/inputs/ElInput.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { localMedia } from '@fiction/ui/stock/localMedia'
import ElSubscriberStart from './SubscriptionStart.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const isLoading = vue.ref(false)
const hideOnboardingSurvey = vue.computed(() => {
  return false
})
const form = vue.ref<{
  role?: string
  roleOther?: string
  goal?: string
  goalOther?: string
}>({ })

const goals = [
  {
    label: 'Establish Authority',
    description: 'Position yourself as a thought leader',
    value: 'authority',
  },
  {
    label: 'Attract Opportunities',
    description: 'Win clients or dream job offers',
    value: 'opportunities',
  },
  {
    label: 'Grow Influence',
    description: 'Build engaged audience',
    value: 'audience',
  },
  {
    label: 'Launch Products',
    description: 'Validate and scale your ideas',
    value: 'products',
  },
  {
    label: 'Simplify Presence',
    description: 'Centralize your professional identity',
    value: 'branding',
  },
]

const roles = [
  {
    label: 'Founder',
    description: 'Building a business or startup',
    value: 'founder',
  },
  {
    label: 'Career Professional',
    description: 'Advancing in current field',
    value: 'pro',
  },
  {
    label: 'Content Creator',
    description: 'Sharing expertise regularly',
    value: 'creator',
  },
  {
    label: 'Consultant',
    description: 'Working with multiple clients',
    value: 'consultant',
  },
  {
    label: 'Investor',
    description: 'Growing network and opportunities',
    value: 'investor',
  },
]

const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        superTitle: {
          text: 'Welcome!',
          theme: 'blue',
          icon: { class: 'i-tabler-rocket' },
        },
        title: 'What\'s your goal with Fiction?',
        subTitle: 'We\'ll use this to help you achieve it.',
        key: 'goal',
        class: 'max-w-lg',
        isNeeded: true,
      },
      {
        superTitle: {
          text: 'Personalize',
          theme: 'rose',
          icon: { class: 'i-tabler-user' },
        },
        title: 'What\'s your current role?',
        subTitle: 'We\'ll use this to personalize your experience.',
        key: 'role',
        class: 'max-w-lg',
        isNeeded: true,
      },
      {
        key: 'payment',
        superTitle: {
          text: 'Pro Trial',
          theme: 'green',
          icon: { class: 'i-tabler-bolt' },
        },
        title: 'Get Started for $1',
        subTitle: 'One month for $1, then $39/mo. Cancel anytime.',
        button: { label: 'Try 1 Month for $1', theme: 'primary', size: 'lg', icon: 'i-tabler-bolt', iconAfter: 'i-tabler-arrow-right' },

        class: 'max-w-screen-xl',
        isNeeded: true,
        noAction: true,
        onClick: async () => {
        },
      },
      {
        key: 'ready',
        superTitle: {
          text: 'Ready',
          theme: 'green',
          icon: { class: 'i-tabler-bolt' },
        },
        title: 'Ready to start?',
        subTitle: 'You\'re all set to start your journey with Fiction.',
        button: {
          label: 'Go to Dashboard',
          theme: 'primary',
          size: 'lg',
          icon: 'i-tabler-bolt',
          iconAfter: 'i-tabler-arrow-right',
        },
        class: 'max-w-screen-lg',
        isNeeded: true,
      },
    ]

    return out
  }),
}

const features = [
  { icon: 'i-tabler-sparkles', text: 'AI Brand Strategy' },
  { icon: 'i-tabler-presentation', text: 'Premium Portfolio' },
  { icon: 'i-tabler-mail', text: 'Client Templates' },
]
</script>

<template>
  <div
    v-if="!hideOnboardingSurvey"
    class="onboarding-survey-veil text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-975 via-black to-theme-975"
  >
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="p-8 text-white absolute left-4 top-4">
        <XMedia class="mx-auto h-[35px]" :media="localMedia.fictionIconInline" />
      </div>
      <div
        class="flex min-h-full flex-col items-center justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <ElStepNav
          v-slot="{ step, changeStep }"
          :step-config="stepConfig"
          data-test-id="createSiteModal"
        >
          <div v-if="step.key === 'goal'" class="space-y-4">
            <ElInput
              v-model="form.goal"
              input="InputRadio"
              :list="goals"
              ui-size="lg"
            />
            <ElInput
              v-if="form.goal === 'other'"
              v-model="form.goalOther"
              input="InputTextarea"
              :rows="2"
              ui-size="lg"
            />
          </div>
          <div v-if="step.key === 'role'" class="space-y-4">
            <ElInput
              v-model="form.role"
              input="InputRadio"
              :list="roles"
              ui-size="lg"
            />
            <ElInput
              v-if="form.role === 'other'"
              v-model="form.roleOther"
              input="InputTextarea"
              :rows="2"
              ui-size="lg"
            />
          </div>
          <!-- Step 3: Payment -->
          <div v-else-if="step.key === 'payment'" class="w-full mx-auto">
            <div class="flex gap-8 justify-center">
              <div class="space-y-6 max-w-[500px] w-full">
                <ElSubscriberStart
                  price-lookup-key="pro_month"
                  trial-type="paid"
                  :button="step.button || {}"
                  class="w-full"
                  @complete="changeStep({ dir: 'next' })"
                />
                <div class="text-xs text-theme-500 mt-4">
                  Secure encryption • Cancel anytime • 24/7 support
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="step.key === 'ready'">
            hello
          </div>
        </ElStepNav>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.onboarding-survey-veil {
  z-index: 5000;
}
</style>

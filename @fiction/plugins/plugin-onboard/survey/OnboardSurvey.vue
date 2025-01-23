<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'

import ElInput from '@fiction/ui/inputs/ElInput.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { localMedia } from '@fiction/ui/stock/localMedia'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const isLoading = vue.ref(false)
const hideOnboardingSurvey = vue.computed(() => {
  return false
})
const form = vue.ref<Record<string, any>>({ })

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
        class: 'max-w-screen-lg',
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
        class: 'max-w-screen-lg',
        isNeeded: true,
      },
      {
        superTitle: {
          text: '14-Day Trial',
          theme: 'green',
          icon: { class: 'i-tabler-bolt' },
        },
        title: 'Start Your 14-Day Trial',
        subTitle: 'Get Premium access to all features.',
        key: 'trial',
        class: 'max-w-screen-lg',
        isNeeded: true,
      },
    ]

    return out
  }),
}
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
        <ElStepNav v-slot="{ step }" :step-config="stepConfig" data-test-id="createSiteModal">
          <div v-if="step.key === 'goal'">
            <ElInput
              v-model="form.title"
              input="InputRadio"
              :list="[
                { label: 'Build a personal brand', value: 'brand' },
                { label: 'Grow my existing audience', value: 'audience' },
                { label: 'Generate leads or sales', value: 'leads' },
                { label: 'Create a portfolio or CV', value: 'resume' },
              ]"
              ui-size="lg"
              data-test-id="siteName"
            />
          </div>
          <div v-if="step.key === 'role'">
            <ElInput
              v-model="form.title"
              input="InputRadio"
              :list="[
                { label: 'Entrepreneur or Founder', value: 'brand' },
                { label: 'Professional or Employee', value: 'audience' },
                { label: 'Creator or Influencer', value: 'leads' },
                { label: 'Job Seeker or Consultant', value: 'resume' },
                { label: 'Leader or Investor', value: 'resume' },
              ]"
              ui-size="lg"
              data-test-id="siteName"
            />
          </div>
          <div v-if="step.key === 'trial'">
            <ElInput
              v-model="form.title"
              input="InputRadio"
              :list="[
                { label: 'Entrepreneur or Founder', value: 'brand' },
                { label: 'Professional or Employee', value: 'audience' },
                { label: 'Creator or Influencer', value: 'leads' },
                { label: 'Job Seeker or Consultant', value: 'resume' },
                { label: 'Leader or Investor', value: 'resume' },
              ]"
              ui-size="lg"
              data-test-id="siteName"
            />
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

<script lang="ts" setup>
import type { EndpointResponse, FictionUser, MediaObject, StepConfig, StepItem } from '@fiction/core'
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

const form = vue.ref<{
  linkedinUrl?: string
  name?: string
  avatar?: MediaObject
  interests?: string
  about?: string
  headline?: string
  needsOnboarding?: boolean
}>({ needsOnboarding: true })

// Save function to update both user and org records
async function save(): Promise<EndpointResponse> {
  const { orgId } = fictionUser.activeOrganization.value || {}
  if (!orgId)
    return { status: 'error' }

  try {
    const { name, needsOnboarding, linkedinUrl, avatar, interests, about, headline } = form.value
    // Save org settings
    await fictionUser.requests.ManageOrganization.projectRequest({
      _action: 'update',
      where: { orgId },
      fields: { orgName: name, needsOnboarding, accounts: { linkedin: linkedinUrl }, avatar, interests, about, headline },
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
        title: 'First, what\'s your LinkedIn URL?',
        subTitle: `We'll use this to personalize your experience`,
        key: 'linkedinUrl',
        class: 'max-w-md',
        allowSkip: false,
      },
      {
        superTitle: {
          text: 'Account',
          icon: { class: 'i-tabler-brush' },
        },
        title: 'Tell us about yourself',
        subTitle: 'Your name, picture, and more on who you are.',
        key: 'account',
        class: 'max-w-md',
        allowSkip: false,
      },
      {
        key: 'ready',
        superTitle: {
          text: 'Ready',
          theme: 'green',
          icon: { class: 'i-tabler-bolt' },
        },
        title: `You\'re All Set!`,
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
          <div v-if="step.key === 'linkedinUrl'">
            <ElInput
              v-model="form.linkedinUrl"
              input="InputText"
              placeholder="https://www.linkedin.com/in/yourname"
              ui-size="lg"
              required
              :input-props="{ autofocus: true }"
            />
          </div>
          <div v-if="step.key === 'account'">
            ...
          </div>
        </ElStepNav>
      </div>
    </div>
  </div>
</template>

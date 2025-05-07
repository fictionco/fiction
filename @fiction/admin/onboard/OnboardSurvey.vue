<script lang="ts" setup>
import type { EndpointResponse, FictionUser, MediaObject, StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import type { ProfileData } from './endpoint'

import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import { useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import InputMedia from '@fiction/ui/inputs/InputMedia.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'
import InputTextarea from '@fiction/ui/inputs/InputTextarea.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { localMedia } from '@fiction/ui/stock/localMedia'

const { card } = defineProps<{ card: Card }>()

const { fictionUser, fictionAdmin } = useService<{ fictionUser: FictionUser, fictionAdmin: FictionAdmin }>()

const profile = vue.ref<ProfileData>({
  needsOnboarding: true,
  linkedinUrl: '',
  name: '',
  handle: '',
  headline: '',
  about: '',
  interests: [],
  influences: [],
  avatar: undefined,
})

const isLoading = vue.ref<'enrich' | 'account' | 'ready' | ''>('')

// Save function to update both user and org records
async function save(): Promise<EndpointResponse> {
  const { orgId } = fictionUser.activeOrganization.value || {}
  if (!orgId)
    return { status: 'error' }

  try {
    // Save org settings
    await fictionAdmin.requests.ManageOnboard.projectRequest({
      _action: 'updateProfile',
      profile: profile.value,
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
vue.watch(() => ({ ...profile.value }), () => {
  saveUtil.autosave({ caller: 'watchForm' })
}, { deep: true })

const stepConfig: StepConfig = {
  onComplete: async () => {
    // This will be called when all steps are completed
  },
  form: profile,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [
      {
        superTitle: {
          text: 'Welcome to Fiction',
          icon: { class: 'i-tabler-north-star' },
          theme: 'primary'
        },
        title: 'First, what\'s your LinkedIn URL?',
        subTitle: 'Used to set up your account',
        key: 'linkedinUrl',
        class: 'max-w-md',
        allowSkip: false,
        isLoading: isLoading.value === 'enrich',
        onClick: async (args) => {
          const { changeStep } = args

          if (!profile.value.linkedinUrl) {
            return
          }

          isLoading.value = 'enrich'

          try {
            const r = await fictionAdmin.requests.ManageOnboard.projectRequest({
              _action: 'enrichFromLinkedIn',
              profile: profile.value,
            }, { disableNotify: true })

            if (r?.status === 'success' && r.data) {
              // Update profile with enriched data
              Object.assign(profile.value, r.data)
              changeStep({ dir: 'next' })
            }
          }
          finally {
            isLoading.value = ''
          }
        },
      },
      {
        superTitle: {
          text: 'Account',
          icon: { class: 'i-tabler-user' },
        },
        title: 'Confirm your details',
        subTitle: 'Your name, handle, and picture',
        key: 'account',
        class: 'max-w-md',
        allowSkip: false,
        isLoading: isLoading.value === 'account',
        onClick: async (args) => {
          const { changeStep } = args
          await saveUtil.forceSync()
          changeStep({ dir: 'next' })
        },
      },
      {
        superTitle: {
          text: 'Profile',
          icon: { class: 'i-tabler-brush' },
        },
        title: 'Tell us about yourself',
        subTitle: 'Your headline and professional bio',
        key: 'profile',
        class: 'max-w-md',
        allowSkip: false,
        onClick: async (args) => {
          const { changeStep } = args
          await saveUtil.forceSync()
          changeStep({ dir: 'next' })
        },
      },
      {
        superTitle: {
          text: 'Interests',
          icon: { class: 'i-tabler-heart' },
        },
        title: 'What inspires you?',
        subTitle: 'Your professional interests and influences',
        key: 'interests',
        class: 'max-w-md',
        allowSkip: false,
        onClick: async (args) => {
          const { changeStep } = args
          await saveUtil.forceSync()
          changeStep({ dir: 'next' })
        },
      },
      {
        key: 'ready',
        superTitle: {
          text: 'Ready',
          theme: 'green',
          icon: { class: 'i-tabler-bolt' },
        },
        title: 'You\'re All Set!',
        subTitle: 'An incredible future awaits. Let\'s begin...',
        button: {
          label: 'Go to Dashboard',
          theme: 'primary',
          size: 'lg',
          icon: 'i-tabler-bolt',
          iconAfter: 'i-tabler-arrow-right',
        },
        class: 'max-w-lg',
        isLoading: isLoading.value === 'ready',
        onClick: async () => {
          isLoading.value = 'ready'
          try {
            profile.value.needsOnboarding = false
            const r = await saveUtil.forceSync()

            if (r?.status === 'success') {
              await card.goto('/?onboarded=true')
            }
          }
          finally {
            isLoading.value = ''
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
      <div class="text-white absolute py-4 md:py-8 px-4 md:px-16 w-full flex justify-between">
        <XMedia class="h-[35px]" :media="localMedia.fictionIconInline" />
        <ElSavingSignal change-type="publish" :is-dirty="saveUtil.isDirty.value" />
      </div>
      <div
        class="flex min-h-full flex-col items-center justify-center p-4 sm:items-center sm:p-0"
      >
        <ElStepNav
          v-slot="{ step }"
          :step-config="stepConfig"
          data-test-id="onboardingSurvey"
        >
          <!-- LinkedIn URL step -->
          <div v-if="step.key === 'linkedinUrl'" class="space-y-6">
            <ElInput
              v-model="profile.linkedinUrl"
              input="InputText"
              placeholder="https://www.linkedin.com/in/yourname"
              ui-size="lg"
              required
              :input-props="{ autofocus: true }"
            />
          </div>

          <!-- Account details step -->
          <div v-if="step.key === 'account'" class="space-y-6">
            <div class="flex justify-center mb-6">
              <InputMedia
                v-model="profile.avatar"
                class="w-24 h-24 rounded-full overflow-hidden"
                :image-props="{ class: 'w-full h-full object-cover' }"
              />
            </div>

            <ElInput
              v-model="profile.name"
              input="InputText"
              label="Your Name"
              placeholder="Enter Your Name"
              required
            />

            <ElInput
              v-model="profile.handle"
              input="InputHandle"
              label="Handle"
              placeholder="handle"
              description="Used to identify you on Fiction"
              required
              v-bind="{
                beforeInput: 'https://',
                afterInput: '.fiction.com',
                table: 'fiction_org',
                columns: [{ name: 'handle' }],
              }"
            />
          </div>

          <!-- Profile step -->
          <div v-if="step.key === 'profile'" class="space-y-6">
            <ElInput
              v-model="profile.headline"
              input="InputText"
              label="Headline"
              placeholder="Leader and innovator."
              description="A concise description of what you do"
            />

            <ElInput
              v-model="profile.about"
              input="InputTextarea"
              label="About"
              placeholder="A brief description of yourself"
              :input-props="{ rows: 5 }"
            />
          </div>

          <!-- Interests and influences step -->
          <div v-if="step.key === 'interests'" class="space-y-6">
            <ElInput
              v-model="profile.interests"
              input="InputTags"
              label="Professional Interests"
              placeholder="Add interests"
              description="Topics you're passionate about (e.g., UX Design, Marketing)"
            />

            <ElInput
              v-model="profile.influences"
              input="InputTags"
              label="Professional Influences"
              placeholder="Add influences"
              description="People or styles that inspire your work"
            />
          </div>

          <!-- Ready step -->
          <div v-if="step.key === 'ready'" class="space-y-6 text-center">
            <div class="flex justify-center mb-4">
              <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <span class="i-tabler-check text-white text-4xl" />
              </div>
            </div>
            <p class="text-theme-400">
              You're set up and ready to go. You can edit these details later.
            </p>
          </div>
        </ElStepNav>
      </div>
    </div>
  </div>
</template>

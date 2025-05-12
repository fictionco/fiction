<script lang="ts" setup>
import type { EndpointResponse, FictionUser, StepActions, StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import type { ProfileData } from './util'

import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import { useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import XProgress from '@fiction/ui/loaders/XProgress.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { localMedia } from '@fiction/ui/stock/localMedia'
import { profileFromAccount } from './util'

const { card } = defineProps<{ card: Card }>()

const { fictionUser, fictionAdmin } = useService<{ fictionUser: FictionUser, fictionAdmin: FictionAdmin }>()

const profile = vue.ref<ProfileData>({
  needsOnboarding: true,
  linkedinHandle: '',
  name: '',
  handle: '',
  headline: '',
  about: '',
  interests: [],
  influences: [],
  avatar: undefined,
})

vue.onMounted(async () => {
  await fictionUser.userInitialized({ caller: 'onboardSurvey' })

  const p = profileFromAccount({ user: fictionUser.activeUser.value, org: fictionUser.activeOrganization.value })

  const routeLinkedinHandle = card.site?.siteRouter.query.value.li as string || undefined

  profile.value = {
    ...profile.value,
    ...p,
    linkedinHandle: routeLinkedinHandle || p.linkedinHandle,
  }
})

type StepKey = 'linkedin' | 'account' | 'profile' | 'interests' | 'ready' | 'enrich'

const isLoading = vue.ref<StepKey | ''>('')
const progressRef = vue.ref<InstanceType<typeof XProgress> | null>(null)
const progressTimer = vue.computed(() => progressRef.value?.progressTimer)
const showProgress = vue.ref(false)
const enrichmentError = vue.ref<string | null>(null)

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
vue.watch(() => profile.value, () => {
  saveUtil.autosave({ caller: 'watchForm' })
}, { deep: true })

const linkedInEnrichmentSteps = [
  { percent: 5, message: 'Fetching your LinkedIn profile...' },
  { percent: 10, message: 'Analyzing data...' },
  { percent: 30, message: 'Extracting highlights...' },
  { percent: 50, message: 'Creating your Fiction profile...' },
  { percent: 90, message: 'Finalizing account setup...' },
  { percent: 100, message: 'Profile enrichment complete!' },
]

async function performLinkedInEnrichment(args: StepActions<StepKey>) {
  const { changeStep } = args

  if (!profile.value.linkedinHandle) {
    console.warn('No LinkedIn URL provided')
    // If no URL is provided, go back to the first step
    changeStep({ step: 'linkedin' })
    return
  }

  enrichmentError.value = null
  isLoading.value = 'linkedin'
  showProgress.value = true

  await vue.nextTick()

  if (!progressTimer.value?.start)
    throw new Error('Progress ref start is not defined')

  progressTimer.value?.start()

  try {
    const r = await fictionAdmin.requests.ManageOnboard.projectRequest({
      _action: 'enrichFromLinkedIn',
      profile: profile.value,
    }, { disableNotify: true })

    if (r?.status === 'success' && r.data) {
      // Update profile with enriched data
      Object.assign(profile.value, r.data)

      // Allow time for progress to complete visually
      setTimeout(() => {
        showProgress.value = false
        isLoading.value = ''
        // Automatically proceed to account step
        changeStep({ step: 'account' })
      }, 1000)
    }
    else {
      enrichmentError.value = 'There was a problem'
      progressTimer.value?.fail('Failed to enrich profile')
      setTimeout(() => {
        showProgress.value = false
        isLoading.value = ''
        // Go back to the LinkedIn URL step
        changeStep({ step: 'linkedin' })
      }, 2000)
    }
  }
  catch (error) {
    enrichmentError.value = 'An error occurred'
    progressTimer.value?.fail('An error occurred')
    setTimeout(() => {
      showProgress.value = false
      isLoading.value = ''
      // Go back to the LinkedIn URL step
      changeStep({ step: 'linkedin' })
    }, 2000)
  }
}

const stepConfig: StepConfig<StepKey> = {
  onComplete: async () => {
    // This will be called when all steps are completed
  },
  form: profile,
  steps: vue.computed<StepItem<StepKey>[]>(() => {
    const out: StepItem<StepKey>[] = [
      {
        superTitle: {
          text: 'Welcome to Fiction',
          icon: { class: 'i-tabler-north-star' },
          theme: 'primary',
        },
        title: 'What\'s your LinkedIn URL?',
        subTitle: 'We\'ll use this to create your Fiction profile',
        key: 'linkedin',
        class: 'max-w-md',
        allowSkip: false,
        isLoading: isLoading.value === 'enrich',
      },
      {
        key: 'enrich',
        title: 'Loading your profile',
        subTitle: 'We\'re creating your Fiction profile based on your LinkedIn data',
        class: 'max-w-md',
        noButton: true,
        isLoading: true,
        // This runs when the loading step is displayed
        onLoad: async (args) => {
          await performLinkedInEnrichment(args)
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
        subTitle: 'Your headline and bio',
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
        <!-- @vue-generic {StepKey} -->
        <ElStepNav
          v-slot="{ step }"
          :step-config="stepConfig"
          data-test-id="onboardingSurvey"
        >
          <!-- LinkedIn URL step -->
          <div v-if="step.key === 'linkedin'" class="space-y-6">
            <ElInput
              v-model="profile.linkedinHandle"
              input="InputHandle"
              placeholder="username"
              ui-size="lg"
              required
              :input-props="{ autofocus: true, beforeInput: 'linkedin.com/in/' }"
            />

            <div v-if="enrichmentError" class=" text-rose-700 rounded-md text-xs text-center font-medium">
              {{ enrichmentError }}
            </div>
          </div>

          <!-- Loading step -->
          <div v-if="step.key === 'enrich'" class="space-y-6">
            <div class="mt-4 w-full">
              <XProgress
                ref="progressRef"
                :steps="linkedInEnrichmentSteps"
                :total-time="25000"
                completion-message="Setup complete!"
              />
            </div>
          </div>

          <!-- Account details step -->
          <div v-if="step.key === 'account'" class="space-y-6">
            <ElInput
              v-model="profile.avatar"
              input="InputMedia"
              label="Avatar"
              :input-props="{
                aspectClass: 'aspect-[1/1]',
                uiSize: 'xxs',
              }"
              required
            />

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
              :input-props="{
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
          <div v-if="step.key === 'interests'" class="space-y-6">
            <ElInput
              v-model="profile.interests"
              input="InputTags"
              label="Interests"
              placeholder="Add interests"
              description="Topics you're passionate about (e.g., Design, Marketing, AI, Politics)"
            />

            <ElInput
              v-model="profile.influences"
              input="InputTags"
              label="Influences"
              placeholder="Add influences"
              description="People, characters, or systems that inspire your style"
            />
          </div>
        </ElStepNav>
      </div>
    </div>
  </div>
</template>

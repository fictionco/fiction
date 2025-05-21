<script lang="ts" setup>
import type { EndpointResponse, FictionUser, StepActions, StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionOnboard } from '.'

import type { ProfileData } from './util'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import { useService, vue } from '@fiction/core'
import { getArchetypesStyles, getImageStyles } from '@fiction/core/schemas/motifs'
import { AutosaveUtility } from '@fiction/core/utils/save'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import XProgress from '@fiction/ui/loaders/XProgress.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { localMedia } from '@fiction/ui/stock/localMedia'
import { profileFromAccount } from './util'

const { card } = defineProps<{ card: Card }>()

const { fictionUser, fictionOnboard, fictionEnv } = useService<{ fictionUser: FictionUser, fictionOnboard: FictionOnboard }>()

const profile = vue.ref<ProfileData>({
  needsOnboarding: true,
  linkedinHandle: '',
  name: '',
  handle: '',
  headline: '',
  about: '',
  goal: '',
  postTitles: [],
  interests: [],
  influences: [],
  avatar: undefined,
  promptImageKey: 'swissPrecision',
  promptContentKey: 'hero',
  primaryColor: 'blue',
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

type StepKey = 'linkedin' | 'account' | 'profile' | 'interests' | 'content' | 'generate' | 'ready' | 'enrich' | 'branding'

const isLoading = vue.ref<StepKey | ''>('')
const enrichProgressRef = vue.ref<InstanceType<typeof XProgress> | null>(null)
const timer = vue.computed(() => enrichProgressRef.value?.progressTimer)

// Save function to update both user and org records
async function save(): Promise<EndpointResponse> {
  return await fictionOnboard.requests.ManageOnboard.projectRequest({ _action: 'updateProfile', profile: profile.value }, { disableNotify: true })
}

const saveUtil = new AutosaveUtility({ onSave: () => save() })

// Watch for form changes and trigger autosave
vue.watch(() => profile.value, () => { saveUtil.autosave({ caller: 'watchForm' }) }, { deep: true })

function resetOnboard(args: { message: string, data: unknown, stepActions: StepActions<StepKey>, step?: StepKey }) {
  const { message, data, stepActions, step = 'linkedin' } = args
  const { changeStep } = stepActions
  fictionEnv.events.emit('notify', { type: 'error', message })
  timer.value?.fail(message)
  console.error('Error:', message, data)
  setTimeout(() => {
    isLoading.value = ''
    // Go back to the LinkedIn URL step
    changeStep({ step })
  }, 2000)
}

async function performLinkedInEnrichment(args: StepActions<StepKey>) {
  const { changeStep } = args

  isLoading.value = 'linkedin'

  const p = profile.value

  if (!p.linkedinHandle) {
    return resetOnboard({ message: 'No LinkedIn URL provided', data: p, stepActions: args })
  }

  if (!timer.value?.start)
    throw new Error('Progress ref start is not defined')

  timer.value?.start({ steps: [
    { percent: 5, message: 'Fetching your LinkedIn profile...' },
    { percent: 10, message: 'Analyzing data...' },
    { percent: 30, message: 'Extracting highlights...' },
    { percent: 50, message: 'Creating your Fiction profile...' },
    { percent: 90, message: 'Finalizing account setup...' },
    { percent: 100, message: 'Profile enrichment complete!' },
  ], totalTime: 20000 })

  try {
    const r = await fictionOnboard.requests.ManageOnboard.projectRequest({ _action: 'enrichFromLinkedIn', profile: p }, { disableNotify: true })

    if (r?.status === 'success' && r.data) {
      // Update profile with enriched data
      Object.assign(profile.value, r.data)
      timer.value?.stop()

      // Allow time for progress to complete visually
      setTimeout(() => {
        isLoading.value = ''
        // Automatically proceed to account step
        changeStep({ step: 'account' })
      }, 1000)
    }
    else {
      resetOnboard({ message: 'There was a problem', data: r, stepActions: args })
    }
  }
  catch (error) {
    resetOnboard({ message: 'An error occurred', data: error, stepActions: args })
  }
}

async function performContentGeneration(args: StepActions<StepKey>) {
  const { changeStep } = args

  isLoading.value = 'generate'

  if (!timer.value?.start) {
    console.error('Progress ref start is not defined')
    return
  }

  timer.value?.start({ steps: [
    { percent: 10, message: 'Analyzing your profile...' },
    { percent: 30, message: 'Creating content...' },
    { percent: 50, message: 'Generating posts...' },
    { percent: 90, message: 'Content generation complete!' },
  ], totalTime: 80000 })

  try {
    const r = await fictionOnboard.requests.ManageOnboard.projectRequest({ _action: 'createDefaultContent', profile: profile.value }, { disableNotify: true })

    if (r?.status === 'success' && r.data) {
      // Update profile with generated content
      Object.assign(profile.value, r.data)
      timer.value?.stop()

      // Allow time for progress to complete visually
      setTimeout(() => {
        isLoading.value = ''
        // Automatically proceed to ready step
        changeStep({ step: 'ready' })
      }, 1000)
    }
    else {
      resetOnboard({ message: 'There was a problem', data: r, stepActions: args, step: 'content' })
    }
  }
  catch (error) {
    resetOnboard({ message: 'An error occurred', data: error, stepActions: args })
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
        class: 'max-w-lg',
        allowSkip: false,
        isLoading: isLoading.value === 'enrich',
      },
      {
        key: 'enrich',
        title: 'Loading your profile',
        subTitle: 'We\'re setting up your Fiction profile',
        class: 'max-w-lg',
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
        class: 'max-w-lg',
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
        subTitle: 'You can change this later',
        key: 'profile',
        class: 'max-w-lg',
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
        subTitle: 'You can change this later',
        key: 'interests',
        class: 'max-w-lg',
        allowSkip: false,
        onClick: async (args) => {
          const { changeStep } = args
          await saveUtil.forceSync()
          changeStep({ dir: 'next' })
        },
      },
      {
        superTitle: {
          text: 'Branding',
          icon: { class: 'i-tabler-palette' },
        },
        title: 'Choose your style',
        subTitle: 'You can change this later',
        key: 'branding',
        class: 'max-w-lg',
        allowSkip: false,
        onClick: async (args) => {
          const { changeStep } = args
          await saveUtil.forceSync()
          changeStep({ dir: 'next' })
        },
      },
      {
        key: 'generate',
        superTitle: {
          text: 'Content',
          icon: { class: 'i-tabler-file-text' },
        },
        title: 'Initial Content',
        subTitle: 'We\'re creating some initial content for you',
        class: 'max-w-lg',
        noButton: true,
        isLoading: true,
        // This runs when the loading step is displayed
        onLoad: async (args) => {
          await performContentGeneration(args)
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
              await card.goto('/?_view=welcome')
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
              data-test-id="linkedinHandle"
            />
          </div>

          <!-- Loading step -->
          <div v-if="step.key === 'enrich' || step.key === 'generate'" class="space-y-6">
            <div class="mt-4 w-full">
              <XProgress ref="enrichProgressRef" />
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
              data-test-id="avatar"
            />

            <ElInput
              v-model="profile.name"
              input="InputText"
              label="Your Name"
              placeholder="Enter Your Name"
              required
              data-test-id="name"
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
              data-test-id="handle"
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
              data-test-id="headline"
            />

            <ElInput
              v-model="profile.about"
              input="InputTextarea"
              label="About"
              placeholder="A brief description of yourself"
              :input-props="{ rows: 5 }"
              data-test-id="about"
            />
          </div>
          <div v-if="step.key === 'interests'" class="space-y-6">
            <ElInput
              v-model="profile.interests"
              input="InputTags"
              label="Interests"
              placeholder="Add interests"
              description="Topics you're passionate about (e.g., Design, Marketing, AI, Politics)"
              data-test-id="interests"
            />

            <ElInput
              v-model="profile.influences"
              input="InputTags"
              label="Role Models"
              placeholder="Add influences"
              description="People, characters, or systems that inspire your style"
              data-test-id="influences"
            />
          </div>
          <div v-if="step.key === 'branding'" class="space-y-6">
            <ElInput
              v-model="profile.promise"
              input="InputText"
              label="Your Content Promise"
              placeholder="Write your promise headline"
              description="A 2-4 word tagline for the value you provide (e.g. 'Learn to code')"
              data-test-id="promise"
            />
            <ElInput
              v-model="profile.primaryColor"
              input="InputColorTheme"
              label="Primary Color"
              description="The main color for your brand"
              :input-props="{
                mode: 'bright',
              }"
              required
              data-test-id="primaryColor"
            />

            <ElInput
              v-model="profile.promptImageKey"
              input="InputSelectCustom"
              label="Image Motif"
              description="Used for generating images"
              :input-props="{ list: getImageStyles() }"
              required
              data-test-id="motif"
            />

            <ElInput
              v-model="profile.promptContentKey"
              input="InputSelectCustom"
              label="Content Archetype"
              description="Used for generating content"
              :input-props="{ list: getArchetypesStyles() }"
              required
              data-test-id="archetype"
            />
          </div>
        </ElStepNav>
      </div>
    </div>
  </div>
</template>

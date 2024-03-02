<script lang="ts" setup>
import { vue } from '@factor/api'
import AuthStart from '@factor/ui/AuthStart.vue'
import ElIcon from '@pagelines/core/ui/ElIcon.vue'
import ElBadge from '@factor/ui/ElBadge.vue'
import type { StepActions, StepConfig, StepItem } from './types'
import StepFlow from './StepFlow.vue'

const form = vue.ref({})

const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [
      {
        name: 'Your First AI Assistant',
        desc: 'Welcome! Let\'s create your first assistbot trained on your website content.',
        actionText: 'Let\'s Go!',
        key: 'start',
        skip: false,
      },
      {
        name: 'Your Account',
        desc: 'We\'ll need an account to save your data. Let\'s quickly create one or login.',
        key: 'auth',
        needsStep: true,
        skip: false,
      },
      {
        name: 'Give It A Name',
        desc: 'Create a name for your avatar model (you can always change this later)...',
        key: 'name',
        needsStep: true,
        skip: false,
      },
      {
        name: 'Upload Concept Images',
        desc: `Upload 5 or more examples of your concept. Results are all about the images you upload`,
        key: 'upload',
        needsStep: true,
        skip: false,
      },
      {
        name: 'Start Server and Train',
        desc: 'Server creation and model training takes a few minutes. You\'ll get notified when it\'s done.',
        actionText: 'Start It!',
        key: 'train',
        skip: false,
        onClick: async (args: StepActions) => {
          const { setStepKey } = args
          setStepKey('progress')
        },
      },
      {
        name: `Training Progress`,
        desc: 'Server start and training takes a few minutes. You\'ll get notified when it\'s done.',
        key: 'progress',
        noAction: true,
        skip: false,
      },
      {
        sup: `Model Is `,
        name: `Your First Prompt`,
        desc: 'Congratulations, you\'ve trained a model! Now let\'s try a prompt. Just type what you want to see.',
        key: 'ready',
        actionText: 'Generate',
        skip: false,
        onClick: async (args: StepActions) => {
          const { setComplete } = args
          await setComplete()
        },
      },
    ].filter(s => !s.skip)

    return out
  }),
}
</script>

<template>
  <div class="bg-theme-0 fixed inset-0 z-30 flex flex-col">
    <div
      class="header relative z-20 flex items-center justify-between px-3 py-4 md:px-8"
    >
      <div class="md:min-w-[150px]">
        <ElIcon class="w-8" />
      </div>
      <div class="grow text-center">
        <span class="text-theme-400 text-xs font-bold uppercase">Creating
        </span>
      </div>
      <div class="flex items-center space-x-6 md:min-w-[150px]">
        <ElBadge
          class="cursor-pointer"
          btn="default"
          to="/org"
        >
          Go To Dashboard
        </ElBadge>
      </div>
    </div>

    <div class="grow overflow-scroll">
      <StepFlow v-slot="{ step }" :step-config="stepConfig">
        <div v-if="step.key === 'auth'">
          123
        </div>
        <div v-else-if="step.key === 'category'">
          <AuthStart :form="form" />
        </div>
        <div v-else-if="step.key === 'upload'">
          upload
        </div>
        <div v-else-if="step.key === 'plan'" />
        <div v-else-if="step.key === 'progress'">
          progress
        </div>
        <div v-else-if="step.key === 'ready'" class="">
          213
        </div>
      </StepFlow>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T = string">
import type { FictionRouter, FictionUser, StepConfig } from '@fiction/core/index.js'
import { useService, vue, waitFor } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElStep from './ElStep.vue'

const { stepConfig, classes = { step: '' }, nextDisabled } = defineProps<{
  stepConfig: StepConfig<T>
  classes?: { step?: string }
  nextDisabled?: boolean
}>()

const { fictionRouter } = useService<{
  fictionRouter: FictionRouter
  fictionUser: FictionUser
}>()

const steps = vue.computed(() => stepConfig.steps.value.filter(s => !s.isJumped))

// Track step history
const stepHistory = vue.ref<number[]>([])

// Track transition direction
const transitionDirection = vue.ref<'next' | 'prev'>('next')

const queryStep = vue.computed<T>({
  get: () => {
    const routeStep = fictionRouter.vars.value.step as string | undefined
    const s = steps.value
    const defaultStep = s[0].key

    return routeStep && s.find(step => step.key === routeStep)
      ? routeStep as T
      : defaultStep as T
  },
  set: async (value: T) => {
    const s = steps.value
    const step = !value || !s.find(step => step.key === value) ? null : value
    await fictionRouter.replace({ query: { step: step as string } })
  },
})

const stepIndex = vue.computed(() => {
  if (!queryStep.value)
    return 0
  const found = steps.value.findIndex(s => s.key === queryStep.value)
  return found > -1 ? found : 0
})

const currentStep = vue.computed(() => {
  return steps.value[stepIndex.value]
})

// Track if a step load is in progress
const isStepLoadInProgress = vue.ref(false)

function checkValid() {
  const form = document.querySelector('#stepForm') as
    | HTMLFormElement
    | undefined

  if (!form)
    return true

  const valid = form?.reportValidity()

  return valid
}

function getStepIndex(args: { dir?: 'prev' | 'next', step?: string }) {
  const { dir, step } = args

  if (step) {
    const found = steps.value.findIndex(s => s.key === step)
    return found
  }
  else {
    const index = stepIndex.value

    if (index >= steps.value.length - 1 && dir === 'next')
      return -1

    if (index === 0 && dir === 'prev')
      return 0

    const num = dir === 'next' ? index + 1 : index - 1

    return num
  }
}

function setStepIndex(index: number, options?: { backOnly?: boolean }) {
  const { backOnly } = options || {}

  const currentIndex = stepIndex.value

  if (index === currentIndex || (backOnly && index > currentIndex))
    return

  queryStep.value = steps.value[index]?.key
}

function setStepKey(key: T) {
  queryStep.value = key
}

async function changeStep(args: {
  dir?: 'prev' | 'next'
  step?: T
  index?: number
  needsValidation?: boolean
  backOnly?: boolean
  clearHistory?: boolean
}) {
  const { dir, step, index, needsValidation, backOnly, clearHistory } = args

  if (needsValidation) {
    const valid = checkValid()

    if (!valid)
      return
  }

  if (dir) {
    const num = getStepIndex({ dir })
    if (num !== -1) {
      setStepKey(steps.value[num]?.key)
    }

    if (dir === 'prev') {
      stepHistory.value.pop()
    }
  }
  else if (step) {
    setStepKey(step)
  }
  else if (index !== undefined) {
    setStepIndex(index, { backOnly })
  }

  if (clearHistory) {
    stepHistory.value = []
  }
}

// Watch for step changes to execute onLoad
vue.watch(
  () => currentStep.value,
  async (newStep, oldStep) => {
    if (newStep && newStep.onLoad && newStep.key !== oldStep?.key) {
      isStepLoadInProgress.value = true
      try {
        // wait for transition and mounting
        await waitFor(600)
        await newStep.onLoad({ changeStep })
      }
      finally {
        isStepLoadInProgress.value = false
      }
    }
  },
  { immediate: true },
)

// Watch for index changes to update history and transition
vue.watch(
  () => stepIndex.value,
  (newIndex, oldIndex) => {
    if (oldIndex !== undefined) {
      if (oldIndex < newIndex && newIndex !== 0 && oldIndex !== stepHistory.value[stepHistory.value.length - 1]) {
        stepHistory.value.push(oldIndex)
      }

      transitionDirection.value = newIndex < oldIndex ? 'prev' : 'next'
    }
  },
)

vue.onBeforeUnmount(async () => {
  const q = fictionRouter.query.value
  await fictionRouter.replace({ query: { ...q, step: undefined } })
})

const hasBack = vue.computed(() => {
  return stepIndex.value > 0 && stepHistory.value.length > 0 && stepIndex.value !== steps.value.length - 1
})

const isNextButtonDisabled = vue.computed(() => {
  return isStepLoadInProgress.value || currentStep.value.isLoading || nextDisabled
})
</script>

<template>
  <ElForm id="stepForm" class="h-full py-[10vh] md:px-12 relative w-full">
    <!-- @vue-generic {T} -->
    <ElStep
      :steps
      :current-index="stepIndex"
      class="steps pointer-events-auto"
      :transit="transitionDirection"
      :data-test-id="`step-${queryStep}`"
      :class="classes.step"
    >
      <template #default="{ step }">
        <div class="space-y-6 py-4">
          <slot :step="step" :change-step="changeStep" />

          <div
            v-if="!step.noButton"
            class="flex pt-2 gap-4 items-center"
            :class="!hasBack ? 'justify-center' : 'justify-between'"
          >
            <XButton
              v-if="hasBack"
              tag="div"
              icon="i-tabler-arrow-left"
              :size="step.button?.size || 'lg'"
              theme="default"
              design="ghost"
              @click.prevent="changeStep({ dir: 'prev', needsValidation: false })"
            >
              Back
            </XButton>
            <XButton
              :theme="step.button?.theme || 'primary'"
              :size="step.button?.size || 'lg'"
              class="step-submit"
              :loading="step.isLoading"
              :animate="true"
              :disabled="isNextButtonDisabled"
              data-test-el="step-submit"
              :data-test-id="`step-button-${step.key}`"
              icon-after="i-tabler-arrow-right"
              @click.prevent="step.onClick ? step.onClick({ changeStep }) : changeStep({ dir: 'next', needsValidation: true })"
            >
              {{ step.button?.label || "Next" }}
            </XButton>
          </div>

          <div v-if="step.allowSkip" class="flex justify-center gap-4 items-center">
            <XButton
              :theme="step.skipButton?.theme || 'default'"
              :size="step.skipButton?.size || 'sm'"
              design="link"
              class="step-skip"
              :animate="true"
              data-test-el="step-skip"
              :data-test-id="`step-button-${step.key}`"
              @click.prevent="changeStep({ dir: 'next', needsValidation: false })"
            >
              {{ step.skipButton?.label || "Skip" }}
            </XButton>
          </div>
        </div>
      </template>
    </ElStep>
    <!-- <NavDots
      class="mt-16 z-20 justify-center relative pointer-events-auto"
      :items="steps"
      :active-item="stepIndex"
      wrap-selector="#stepForm"
      @click.stop
      @update:active-item="changeStep({ index: $event, backOnly: true, clearHistory: true })"
    /> -->
  </ElForm>
</template>

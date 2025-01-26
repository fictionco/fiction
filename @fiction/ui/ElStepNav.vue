<script lang="ts" setup>
import type { FictionRouter, FictionUser, StepConfig, StepItem } from '@fiction/core/index.js'
import NavDots from '@fiction/cards/el/NavDots.vue'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElStep from './ElStep.vue'

const { stepConfig, classes = { step: '' } } = defineProps<{
  stepConfig: StepConfig
  classes?: { step?: string }
}>()

const { fictionRouter } = useService<{
  fictionRouter: FictionRouter
  fictionUser: FictionUser
}>()

const steps = vue.computed(() => {
  return stepConfig.steps.value.filter(s => !s.isSkipped)
})

async function setComplete() {}

const queryStep = vue.computed({
  get: () => {
    const routeStep = fictionRouter.vars.value.step as string | undefined
    const s = steps.value
    const defaultStep = s[0].key

    return routeStep && s.find(step => step.key === routeStep)
      ? routeStep
      : defaultStep
  },
  set: async (value: string) => {
    const s = steps.value
    const step = !value || !s.find(step => step.key === value) ? null : value
    await fictionRouter.replace({ query: { step } })
  },
})

const stepIndex = vue.computed(() => {
  if (!queryStep.value)
    return 0
  const found = steps.value.findIndex(s => s.key === queryStep.value)
  return found > -1 ? found : 0
})

function checkValid() {
  const form = document.querySelector('#stepForm') as
    | HTMLFormElement
    | undefined

  if (!form)
    return true

  const valid = form?.reportValidity()

  return valid
}
function getStepIndex(dir: 'prev' | 'next') {
  const index = stepIndex.value

  if (index >= steps.value.length - 1 && dir === 'next')
    return -1

  if (index === 0 && dir === 'prev')
    return 0

  const num = dir === 'next' ? index + 1 : index - 1

  return num
}

function setStepIndex(index: number) {
  queryStep.value = steps.value[index]?.key || ''
}
function setStepKey(key: string) {
  queryStep.value = key
}

async function changeStep(args: {
  dir?: 'prev' | 'next'
  step?: string
  index?: number
}) {
  const { dir, step, index } = args

  if (dir) {
    const num = getStepIndex(dir)

    if (num !== -1) {
      setStepKey(steps.value[num]?.key || '')
    }
  }
  else if (step) {
    setStepKey(step)
  }
  else if (index !== undefined) {
    setStepIndex(index)
  }
}

const stepActions = {
  changeStep,
  setStepIndex,
  setStepKey,
  setComplete,
}

async function next(currentStep: StepItem) {
  const valid = checkValid()

  if (!valid || currentStep.isLoading)
    return

  if (currentStep.onClick)
    await currentStep.onClick(stepActions)
  else
    changeStep({ dir: 'next' })
}

vue.onBeforeUnmount(async () => {
  await fictionRouter.replace({ query: { step: undefined } })
})
</script>

<template>
  <ElForm id="stepForm" class="h-full py-[10vh] md:px-12 relative w-full">
    <ElStep
      :steps
      :current-index="stepIndex"
      class="steps pointer-events-auto"
      transit="next"
      :data-test-id="`step-${queryStep}`"
      :class="classes.step"
    >
      <template #default="{ step }">
        <div class="space-y-6 py-4">
          <slot :step="step" :change-step="changeStep" />

          <div
            v-if="!step.noAction"
            class="flex justify-center"
          >
            <XButton
              :theme="step.button?.theme || 'primary'"
              :size="step.button?.size || 'lg'"
              class="step-submit"
              :loading="step.isLoading"
              :animate="true"
              data-test-el="step-submit"
              :data-test-id="`step-button-${step.key}`"
              icon-after="i-tabler-arrow-right"
              @click.prevent="next(step)"
            >
              {{ step.button?.label || step.actionText || "Next" }}
            </XButton>
          </div>
        </div>
      </template>
    </ElStep>
    <NavDots
      class="mt-16 z-20 justify-center relative pointer-events-auto"
      :items="steps"
      :active-item="stepIndex"
      wrap-selector="#stepForm"
      @click.stop
      @update:active-item="setStepIndex($event)"
    />
  </ElForm>
</template>

<style lang="less">
.steps {
  --input-x: 0.7em;
  --input-y: 0.5em;
  --input-max-width: 100%;
  --input-size: 1.4em;
  --input-bg: theme("colors.theme.50");
}

.alist-item {
  transition: all 0.5s ease;
}

.alist-enter-active {
  animation: aListIn 0.5s;
  animation-delay: var(--delay);
}

.alist-leave-active {
  animation: aListOut 0.5s;
  animation-delay: var(--delay);
}

@keyframes aListIn {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes aListOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>

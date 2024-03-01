<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
  StepConfig,
} from '@factor/api'
import { useService, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElStep from './ElStep.vue'

const props = defineProps({
  stepConfig: {
    type: Object as vue.PropType<StepConfig>,
    required: true,
  },
})

useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const steps = vue.computed(() => {
  return props.stepConfig.steps.value.filter(s => !s.isSkipped)
})

const stepKey = vue.ref('')

const stepIndex = vue.computed(() => {
  if (!stepKey.value)
    return 0
  const found = steps.value.findIndex(s => s.key === stepKey.value)
  return found > -1 ? found : 0
})
const currentStep = vue.computed(() => steps.value[stepIndex.value])

async function setComplete() {}

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

async function changeStep(dir: 'prev' | 'next') {
  if (dir === 'next') {
    const valid = checkValid()

    if (!valid)
      return
  }

  const num = getStepIndex(dir)

  if (num !== -1)
    stepKey.value = steps.value[num].key
}
function setStepIndex(index: number) {
  stepKey.value = steps.value[index].key
}
function setStepKey(key: string) {
  stepKey.value = key
}

const stepActions = {
  changeStep,
  setStepIndex,
  setStepKey,
  setComplete,
}
</script>

<template>
  <ElForm id="stepForm" class="h-full overflow-scroll py-[12vh] relative">
    <ElStep
      v-slot="{ step }"
      :steps="steps"
      :current-index="stepIndex"
      class="steps"
      transit="next"
    >
      <div class="space-y-8">
        <slot :step="step" />

        <div
          v-if="!currentStep.noAction"
          class="flex justify-center md:justify-end"
        >
          <ElButton
            btn="primary"
            size="lg"
            :loading="step.isLoading"
            :animate="true"
            @click.prevent="
              currentStep.onClick
                ? currentStep.onClick(stepActions)
                : changeStep('next')
            "
          >
            {{ step.actionText || "Next" }}
          </ElButton>
        </div>
      </div>
    </ElStep>
    <div class="nav mt-12 flex w-full justify-center space-x-3">
      <div
        v-for="(s, i) in steps"
        :key="i"
        class="h-3 rounded-full transition-all duration-700 bg-theme-300"
        :class="
          i === stepIndex
            ? ' w-5'
            : 'opacity-40 hover:opacity-100 cursor-pointer w-3'
        "
        @click="setStepIndex(i)"
      />
    </div>
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

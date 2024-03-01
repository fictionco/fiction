<script lang="ts" setup>
import EffectGrid from '@factor/ui/EffectGrid.vue'
import {
  emitEvent,
  localRef,
  notify,
  objectId,
  toLabel,
  vue,
} from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import InputText from '@factor/ui/InputText.vue'
import InputSelectCustom from '@factor/ui/InputSelectCustom.vue'
import ElForm from '@factor/ui/ElForm.vue'
import InputTextarea from '@factor/ui/InputTextarea.vue'
import type { RenderConfig } from '../../tables'
import ElServerButton from '../../plugin-instance/ElServerButton.vue'
import ElJobProgress from '../../plugin-instance/ElJobProgress.vue'
import InputMediaMultiple from '../../ui/image-upload/InputMediaMultiple.vue'
import Logo from '../../ui/FictionLogo.vue'
import ElBadge from '../../ui/ElBadge.vue'
import { useFictionApp } from '../../util'
import { regularizationThemes } from '../../plugin-app-dreambooth/lib'
import { Model } from '../../plugin-models/model'
import type { ImageFile } from '../../ui/image-upload/handler'
import ElStep from './ElStep.vue'

const {
  factorUser,
  factorRouter,
  fictionModel,
  fictionInstance,
  fictionPush,
  factorStripe,
  fictionPayment,
  fictionOnboard,
} = useFictionApp()

const firstPrompt = vue.ref(
  'portrait of an attractive [c], leds, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8 k',
)
const orgId = vue.computed(() => factorRouter.params.value.organizationId)

const modelId = localRef({
  key: `onboardModelId-${orgId.value || 'unknown'}`,
  def: objectId({ prefix: 'nmo' }),
  lifecycle: 'local',
})
const stepKey = localRef({
  key: `onboardStepKey-${orgId.value || 'unknown'}`,
  def: '',
  lifecycle: 'local',
})

const activeModel = vue.shallowRef<Model>(
  new Model({
    fictionModel,
    modelId: modelId.value,
    conceptsList: [{}],
    templateConfig: { maxTrainSteps: 1200, learningRate: 2e-6 },
  }),
)

const std = [
  `Unlimited Models and Generations`,
  `AI Editing Tools`,
  `Porfolio and Sharing Tools`,
  `New Features Weekly`,
]

const plans = [
  {
    name: 'Standard',
    desc: '$19/mo After Free Trial',
    value: 'standard',
    priceId: `price_1MUFtqFofsEYcKEPiZ2oRHlr`,
    bestFor: 'Best For Personal Use',
    details: ['150 minutes per month (GPU time)', ...std],
  },
  {
    name: 'Pro',
    desc: '$99/mo After Free Trial',
    value: 'pro',
    priceId: `price_1MUFufFofsEYcKEPXqAKbBsJ`,
    bestFor: 'Best For Professionals and Designers',
    details: [
      '720 minutes per month (GPU time)',
      `Unlimited Team Members`,
      ...std,
    ],
  },
  {
    name: 'Developer',
    desc: '$199/mo After Free Trial',
    value: 'developer',
    priceId: 'price_1MUFvqFofsEYcKEPIGAqa0SJ',
    bestFor: 'Best For Developers and Businesses',
    details: [
      '1,500 minutes per month (GPU time)',
      `API Access`,
      `Priority Support`,
      ...std,
    ],
  },
]
const selectedPlan = vue.ref('')
const selectedPlanDetails = vue.computed(() => {
  const found = plans.find(p => p.value === selectedPlan.value)
  return found
})

const stepIndex = vue.computed(() => {
  if (!stepKey.value)
    return 0
  const found = steps.value.findIndex(s => s.key === stepKey.value)
  return found > -1 ? found : 0
})
const currentStep = vue.computed(() => steps.value[stepIndex.value])

vue.onMounted(async () => {
  await setModel()
})

const form = vue.shallowRef<{
  modelName?: string
  conceptCategory?: string
  customConcept?: boolean
}>({})

const images = vue.shallowRef<ImageFile[]>([])

const sending = vue.ref('')

async function setModel() {
  if (!modelId.value)
    return

  const model = await fictionModel.findOne({
    id: modelId.value,
    table: 'model',
  })

  if (model) {
    activeModel.value = model

    if (activeModel.value.status.value === 'ready')
      setStepKey('ready')
  }
}

vue.watch(
  () => fictionInstance.activeJob.value,
  async (val, old) => {
    /**
     * This should update when model is done, started
     * It shouldn't refresh on server start, etc
     */
    if (
      val?.status !== old?.status
      && (val?.progressId === modelId.value || old?.progressId === modelId.value)
    )
      await setModel()
  },
)

async function saveModel() {
  sending.value = 'save'

  const r = await fictionModel.uploadRequest({
    _action: 'save',
    model: activeModel.value,
  })

  if (r?.data)
    activeModel.value?.updateModel(r.data)

  sending.value = ''
}

async function startTraining() {
  sending.value = 'train'

  const organizationId = factorUser.activeOrganizationId.value

  if (!organizationId) {
    notify.error('there was a problem loading your organization', {
      more: 'refresh the page',
    })
    return
  }

  const m = activeModel.value
  const concept = m.fullConceptsList.value[0]
  const handler = concept.instanceImageHandler
  if (!m.modelName.value) {
    notify.error('Model name is missing!')
    sending.value = ''
    return
  }
  if (!concept.classCategory.value) {
    notify.error('Concept type is missing!')
    sending.value = ''
    return
  }

  if (handler.files.value.length < 3) {
    notify.error('You must upload at least one image to train a model')
    sending.value = ''
    return
  }

  const r = await fictionModel.uploadRequest({
    _action: 'train',
    isQueued: true,
    model: activeModel.value,
  })

  if (r?.data)
    activeModel.value?.updateModel(r.data)

  sending.value = ''
}

async function welcomeComplete(args: {
  reason: string
  withRender: boolean
}) {
  const { reason, withRender = false } = args
  console.warn('welcomeComplete', args)
  sending.value = 'welcome'
  const organizationId = factorUser.activeOrganizationId.value
  if (!organizationId)
    return
  await factorUser.requests.ManageOnboard.projectRequest({
    _action: 'update',
    settings: { tasks: { trainFirstModel: 'ready' } },
    mode: 'organization',
  })

  if (withRender) {
    const renderConfig: Partial<RenderConfig> = {
      prompt: firstPrompt.value,
      addWatermark: true,
      guidanceScale: 7.5,
      numInferenceSteps: 80,
      numOutputs: 2,
      aspect: 'square',
    }

    await fictionModel.requests.ManageRender.projectRequest({
      _action: 'create',
      modelId: modelId.value,
      renderConfig,
    })

    await factorRouter.goto('renderCreate', { modelId: modelId.value })

    emitEvent('setRenderData', renderConfig)
  }

  sending.value = ''
}

function checkValid() {
  const form = document.querySelector('#stepForm') as
    | HTMLFormElement
    | undefined

  if (!form)
    throw new Error('No form found')

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

  if (num === -1) {

  }
  else {
    stepKey.value = steps.value[num].key
  }
}
function setStepIndex(index: number) {
  stepKey.value = steps.value[index].key
}
function setStepKey(key: string) {
  stepKey.value = key
}

const allSteps = vue.computed(() => {
  const modelStatus = activeModel.value.status.value
  const concept = activeModel.value.fullConceptsList.value?.[0]
  const images = concept.instanceImageHandler.files.value || []
  const modelName = activeModel.value.modelName.value
  const modelInProcess
    = modelStatus === 'requested'
    || modelStatus === 'ready'
    || modelStatus === 'processing'

  const activeCustomer = fictionPayment.activeCustomer.value

  const hasPlan
    = activeCustomer?.totalQuantity && activeCustomer?.totalQuantity > 0
  return [
    {
      name: 'Training Your First Model',
      desc: 'Welcome! As a first step, let\'s teach AI a concept. This is also called training a model.',
      actionText: 'Let\'s Go!',
      key: 'start',
      skip: modelInProcess,
    },
    {
      name: 'Give It A Name',
      desc: 'Create a name for your avatar model (you can always change this later)...',
      key: 'name',
      needsStep: !modelName,
      skip: modelInProcess,
    },
    {
      name: 'Select Avatar Type',
      desc: 'Select a pre-defined avatar type (this helps improve results)',
      key: 'category',
      needsStep: !concept.classCategory.value,
      skip: modelInProcess,
    },
    {
      name: 'Upload Concept Images',
      desc: `Upload 5 or more examples of your concept. Results are all about the images you upload (${images.length} Added)`,
      key: 'upload',
      needsStep: images.length < 5,
      skip: modelInProcess,
    },
    {
      name: 'Start Server and Train',
      desc: 'Server creation and model training takes a few minutes. You\'ll get notified when it\'s done.',
      actionText: 'Start It!',
      key: 'train',
      skip: modelStatus === 'ready' || fictionInstance.activeJob.value,
      onClick: async () => {
        await fictionPush.subscribeUserToPush()
        await startTraining()
        setStepKey('progress')
      },
    },
    {
      name: `Training Progress`,
      desc: 'Server start and training takes a few minutes. You\'ll get notified when it\'s done.',
      key: 'progress',
      noAction: true,
      skip:
        modelStatus === 'ready'
        || (!modelInProcess && !fictionInstance.activeJob.value),
    },
    {
      sup: `Model Is ${toLabel(modelStatus)}`,
      name: `Your First Prompt`,
      desc: 'Congratulations, you\'ve trained a model! Now let\'s try a prompt. Just type what you want to see.',
      key: 'ready',
      actionText: 'Generate',
      skip: modelStatus !== 'ready',
      onClick: async () => {
        await welcomeComplete({ reason: 'complete', withRender: true })
      },
    },
  ].filter(s => !s.skip)
})

const steps = vue.computed(() => {
  return allSteps.value.filter(s => !s.skip)
})
</script>

<template>
  <div
    v-if="fictionOnboard.trainFirstModelVisible.value"
    class="from-theme-50 via-theme-100 to-theme-200 fixed inset-0 z-30 flex flex-col bg-gradient-to-br"
  >
    <div
      class="header relative z-20 flex items-center justify-between px-3 py-4 md:px-8"
    >
      <div class="md:min-w-[150px]">
        <Logo class="scheme-light h-[18px] w-auto md:h-[22px]" />
      </div>
      <div class="grow text-center">
        <ElServerButton v-if="stepKey === 'progress'" />
      </div>
      <div class="flex items-center space-x-6 md:min-w-[150px]">
        <ElBadge
          class="bg-theme-200 text-theme-500 hover:bg-theme-200 hover:text-theme-700 cursor-pointer text-xs md:text-base"
          btn="naked"
          @click="welcomeComplete({ reason: 'skip', withRender: false })"
        >
          Skip Onboarding
        </ElBadge>
      </div>
    </div>

    <div class="grow overflow-scroll">
      <ElForm id="stepForm" class="h-full overflow-scroll px-4 py-[10vh]">
        <ElStep
          v-slot="{ step }"
          :steps="steps"
          :current-index="stepIndex"
          class="steps"
          transit="next"
        >
          <div class="space-y-6">
            <div v-if="step.key === 'name'">
              <div>
                <InputText
                  v-model="activeModel.modelName.value"
                  placeholder="My Model"
                  required
                />
              </div>
            </div>
            <div v-else-if="step.key === 'category'">
              <InputSelectCustom
                v-if="!form.customConcept"
                v-model="
                  activeModel.fullConceptsList.value[0].classCategory.value
                "
                label="Type of Concept"
                required
                :list="regularizationThemes"
              />

              <!-- <InputText
                v-else
                v-model="form.conceptCategory"
                placeholder="Car"
                required
                :list="regularizationThemes"
              />
              <div class="mt-2">
                <InputToggle
                  v-model="form.customConcept"
                  text-on="Custom Concept"
                  text-off="Custom Concept"
                ></InputToggle>
              </div> -->
            </div>
            <div v-else-if="step.key === 'upload'">
              <InputMediaMultiple
                v-model="images"
                :handler="
                  activeModel.fullConceptsList.value[0].instanceImageHandler
                "
                :min="5"
              />
              <div class="text-theme-500 mt-3 flex space-x-3 text-xs">
                <div class="font-bold">
                  Tip:
                </div>
                <div>
                  Go for consistency of the thing you want to train.. For
                  people, use similar facial expressions, with differing
                  backgrounds and lighting conditions.
                </div>
              </div>
            </div>
            <div v-else-if="step.key === 'plan'">
              <InputSelectCustom
                v-model="selectedPlan"
                required
                :list="plans"
              />
              <transition name="fade" mode="out-in">
                <div
                  v-if="selectedPlanDetails"
                  class="bg-theme-100 text-theme-600 my-4 space-y-1 rounded-lg p-4 text-xs font-bold"
                >
                  <div class="text-theme-600 text-sm">
                    {{ selectedPlanDetails.name }} Plan -
                    {{ selectedPlanDetails.bestFor }}
                  </div>
                  <div
                    v-for="(detail, i) in selectedPlanDetails.details"
                    :key="`${selectedPlan}-${detail}`"
                    class="alist-item text-theme-500 flex items-center space-x-2"
                    :style="{ '--delay': `${i * 100}ms` }"
                  >
                    <div class="text-primary-500">
                      <div class="i-heroicons-check-20-solid text-xl" />
                    </div>
                    <div>{{ detail }}</div>
                  </div>
                </div>
              </transition>
            </div>
            <div v-else-if="step.key === 'progress'">
              <ElJobProgress
                :progress-ids="['start', activeModel.modelId.value || '']"
                :show-waiting="activeModel.status.value"
              />
            </div>
            <div v-else-if="step.key === 'ready'" class="">
              <div>
                <InputTextarea
                  v-model="firstPrompt"
                  :rows="6"
                  class="font-mono !text-[1.1rem] leading-[1.4]"
                />
              </div>
              <div class="my-12 flex space-x-3 text-xs">
                <div class="font-bold">
                  Tips:
                </div>
                <div>
                  <ul class="list-outside list-disc space-y-2 pl-6 font-medium">
                    <li>
                      <div class="font-extrabold">
                        Reference Your Concept:
                      </div>
                      Use <span class="font-bold">[c]</span> in prompts to
                      reference the concept you just trained.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              v-if="!currentStep.noAction"
              class="flex justify-center md:justify-start"
            >
              <ElButton
                size="xl"
                btn="primary"
                :loading="!!sending"
                :animate="true"
                @click.prevent="
                  currentStep.onClick
                    ? currentStep.onClick()
                    : changeStep('next')
                "
              >
                {{ step.actionText || "Next" }}
              </ElButton>
            </div>
          </div>
        </ElStep>
        <div
          class="nav absolute bottom-20 flex w-full justify-center space-x-3"
        >
          <div
            v-for="(s, i) in steps"
            :key="i"
            class="h-3 w-3 rounded-full"
            :class="
              i === stepIndex
                ? 'bg-primary-500'
                : 'bg-theme-300 hover:bg-theme-400 cursor-pointer'
            "
            @click="setStepIndex(i)"
          />
        </div>
      </ElForm>
    </div>
    <div class="pointer-events-none fixed top-0 h-screen w-screen">
      <EffectGrid alt-color="bg-pink-500" mode="light" />
    </div>
  </div>
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

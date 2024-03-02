<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import DropDown from '@factor/ui/DropDown.vue'
import ElInputGroup from '@factor/ui/ElInputGroup.vue'
import type { ActionItem } from '@factor/api'
import { notify, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElModal from '@factor/ui/ElModal.vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import ElModalBanner from '@factor/ui/ElModalBanner.vue'
import AdminPage from '../../plugin-admin/AdminPage.vue'
import { regularizationThemes } from '../../plugin-app-dreambooth/lib'
import { useFictionApp } from '../../util'
import InputMediaMultiple from '../../ui/image-upload/InputMediaMultiple.vue'
import type { Model } from '../model'
import ElJobProgress from '../../plugin-instance/ElJobProgress.vue'

const {
  factorRouter,
  factorUser,
  fictionModel,
  fictionInstance,
  fictionUsage,
} = useFictionApp()

const sending = vue.ref<boolean | string>('')
const activeModel = vue.shallowRef<Model>()

const routeModelId = vue.computed<string>({
  get: () => factorRouter.params.value.modelId as string,
  set: val => factorRouter.goto('modelTrain', { modelId: val }),
})

const noRemainingModels = vue.computed(() => {
  const u = fictionUsage.activeUsage.value
  const remainingModels = u?.remainingModels ?? 1

  return remainingModels <= 0
})
const isActivelyTraining = vue.computed(() => {
  const j = fictionInstance.activeJob.value || {}

  return j.progressId === routeModelId.value && j.status === 'processing'
})

async function setModel() {
  const model = await fictionModel.findOne({
    id: routeModelId.value,
    table: 'model',
  })

  if (model)
    activeModel.value = model
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
      && (val?.progressId === routeModelId.value
      || old?.progressId === routeModelId.value)
    )
      await setModel()
  },
)

async function addConcept() {
  const model = activeModel.value

  if (!model)
    return

  const existing = model.fullConceptsList.value.map(c =>
    c.toPortable({ mode: 'record' }),
  )

  model.conceptsList.value = [...existing, {}]
}

vue.onMounted(async () => {
  await factorUser.pageInitialized()

  if (!routeModelId.value)
    await factorRouter.goto('modelIndex', {}, { create: 1 })

  vue.watch(
    () => routeModelId.value,
    async (val) => {
      if (val)
        await setModel()
    },
    { immediate: true },
  )

  const tid = factorRouter.query.value.templateId

  if (tid && activeModel.value)
    activeModel.value.templateId.value = tid as string
})

async function send(context: 'save' | 'train'): Promise<void> {
  if (!activeModel.value || typeof document === 'undefined')
    return

  const form = document.querySelector('#modelForm') as
    | HTMLFormElement
    | undefined

  if (!form)
    throw new Error('No form found')

  const valid = form?.reportValidity()

  if (!valid)
    return

  if (context === 'train') {
    const min = 3

    const s = await fictionInstance.verifyServerActive({ withModal: true })
    if (!s)
      return notify.error('Server is off. Turn it on?')

    // for loop through concepts returning if it fails validation
    for (const concept of activeModel.value.fullConceptsList.value) {
      const images = concept.instanceImageHandler.files.value.length
      if (images < min) {
        return notify.error(
          `each concept needs at least ${min} images (${images})`,
        )
      }
      else if (!concept?.instanceToken.value) {
        return notify.error('instance token is missing')
      }
      else if (!concept?.classToken.value) {
        return notify.error('concept category (class token) is missing')
      }
    }
  }

  sending.value = context

  const r = await fictionModel.uploadRequest({
    _action: context,
    trainingHandling: activeModel.value.templateConfig.value.trainingHandling,
    model: activeModel.value,
  })

  if (r?.data)
    activeModel.value?.updateModel(r.data)

  if (r?.data?.modelId && r?.data?.modelId !== routeModelId.value)
    routeModelId.value = r.data.modelId

  sending.value = false
}

function conceptActions(ind: number) {
  const m = activeModel.value
  const actions: ActionItem[] = []

  if (m && m.conceptsList.value.length > 1) {
    actions.push({
      name: 'Remove Concept',
      icon: 'i-heroicons-trash-20-solid',
      btn: 'default',
      onClick: () => {
        const model = activeModel.value

        if (!model)
          return

        model.conceptsList.value.splice(ind, 1)
      },
    })
  }

  return actions
}

const guidance = [
  'Quality over quantity, 10 quality images are better than 20+ low quality images',
  'Only one subject (person, thing, style) per concept',
  'For people, train a single facial expression or age. Don\'t combine them.',
  'Add photos in different lighting conditions',
  'No black and white photos',
  'Don\'t use same setting in multiple photos (to avoid overfit)',
  'Minimize accessories, makeup, irrelevant objects',
  'Regularization images are optional, but help with quality.',
  'Rendering Multi-Concept: stable diffusion will combine concepts rather than separate them. Use inpainting to separate them.',
]
</script>

<template>
  <AdminPage
    :requires="['plan', 'instance']"
    :loading="!!routeModelId && !activeModel"
    :title="`<span class='text-primary-500 mr-2'>Model &rarr;</span > ${activeModel?.modelName.value}`"
  >
    <template #editor>
      <ElForm
        v-if="activeModel"
        id="modelForm"
        class="flex h-full flex-col"
      >
        <div
          class="min-h-0 grow overflow-scroll p-6"
          :class="sending ? 'opacity-60 pointer-events-none' : ''"
        >
          <div class="space-y-4">
            <div class="border-theme-200 rounded-md border px-4 py-2">
              <div class="flex items-center justify-between">
                <div
                  class="text-theme-400 py-1 text-sm font-bold tracking-tight"
                >
                  Model Details
                </div>
              </div>
              <div class="my-3 space-y-3">
                <ElInput
                  v-model="activeModel.modelName.value"
                  label="Status"
                  sub-label="The training status of the model."
                >
                  <div class="flex space-x-4">
                    <div
                      class="my-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold capitalize leading-4"
                      :class="
                        activeModel.status.value === 'ready'
                          ? 'bg-emerald-100 text-emerald-600'
                          : activeModel.status.value === 'requested'
                            ? 'bg-amber-100 text-amber-700'
                            : activeModel.status.value === 'processing'
                              ? 'bg-primary-100 text-primary-500'
                              : activeModel.status.value === 'error'
                                ? 'bg-danger-100 text-danger-500'
                                : 'bg-theme-200 text-theme-500'
                      "
                    >
                      {{ activeModel.status.value || "pending" }}
                    </div>
                    <a
                      v-if="activeModel.status.value === 'ready'"
                      :href="
                        factorRouter.link('renderCreate', {
                          modelId: routeModelId,
                        }).value
                      "
                      class="bg-theme-100 hover:bg-theme-200 text-theme-500 my-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold capitalize leading-4"
                    >
                      Generate &rarr;
                    </a>
                  </div>
                </ElInput>

                <ElInput
                  v-model="activeModel.modelName.value"
                  label="Model Name"
                  sub-label="Used for reference in the future."
                  input="InputText"
                  placeholder="My Model"
                  required
                />
              </div>
            </div>

            <ElInputGroup label="Training Settings">
              <div class="space-y-4">
                <ElInput
                  v-model="activeModel.baseModel.value"
                  label="Base Model"
                  sub-label="Select the base model to train"
                  input="InputSelectCustom"
                  :list="[
                    {
                      name: 'Stable Diffusion 1.5',
                      value: 'runwayml/stable-diffusion-v1-5',
                      isDefault: true,
                    },
                    {
                      name: 'Stable Diffusion Inpainting',
                      value: 'runwayml/stable-diffusion-inpainting@fp16',
                    },
                  ]"
                  required
                />
                <ElInput
                  v-model="activeModel.templateConfig.value.learningRate"
                  label="Learning Rate"
                  sub-label="How much the model learns per step"
                  input="InputRange"
                  default-value=".000002"
                  min=".000001"
                  max=".000007"
                  step=".000001"
                />

                <ElInput
                  v-model="activeModel.templateConfig.value.maxTrainSteps"
                  label="Training Steps"
                  sub-label="The number of training steps to run."
                  input="InputRange"
                  default-value="1200"
                  min="600"
                  max="3500"
                  step="100"
                />
                <ElInput
                  v-if="activeModel.status.value === 'ready'"
                  v-model="activeModel.templateConfig.value.trainingHandling"
                  label="Additional Training Handling"
                  sub-label="How do you want to handle additional training?"
                  input="InputSelectCustom"
                  :list="[
                    {
                      value: 'createNew',
                      label: 'Create New Model',
                      desc: 'Trains a new model from this one',
                    },
                    {
                      value: 'retrain',
                      label: 'Retrain Existing Model',
                      desc: 'Retrains and overwrites this model',
                      isDefault: true,
                    },
                  ]"
                />
              </div>
            </ElInputGroup>

            <ElInputGroup label="Tips and Guidance">
              <div
                v-if="guidance"
                class="grid grid-cols-1 gap-x-12 gap-y-2 text-[11px]"
              >
                <div
                  v-for="(item, i) in guidance"
                  :key="i"
                  class="flex items-center space-x-2"
                >
                  <div class="text-theme-400">
                    <div class="i-carbon-checkmark shrink-0 text-base" />
                  </div>
                  <div>{{ item }}</div>
                </div>
              </div>
            </ElInputGroup>
          </div>
        </div>

        <div class="border-theme-300 border-t p-6 pb-12">
          <div
            v-if="noRemainingModels"
            class="border-caution-300 text-caution-600 bg-caution-50 mb-4 rounded-md border p-3 text-xs font-bold"
          >
            You've used all of your available trainings for the current cycle
            ({{ fictionUsage.activeUsage.value?.paidModels }}). Please upgrade
            your subscription to train more.
          </div>
          <div class="flex space-x-4">
            <ElButton
              btn="primary"
              size="xl"
              format="block"
              :loading="sending === 'train' || isActivelyTraining"
              :disabled="noRemainingModels"
              @click.prevent.stop="send('train')"
            >
              Train
            </ElButton>
            <ElButton
              btn="default"
              size="xl"
              format="block"
              :loading="sending === 'save'"
              @click.prevent.stop="send('save')"
            >
              Save
            </ElButton>
          </div>
        </div>
      </ElForm>
    </template>
    <div
      v-if="activeModel"
      class="space-y-6 transition-all"
      :class="sending ? 'opacity-60 pointer-events-none' : ''"
    >
      <ElJobProgress :progress-ids="[routeModelId]" />

      <ElPanel
        v-for="(concept, i) in activeModel.fullConceptsList.value"
        :key="i"
        title="Concept"
        :actions="conceptActions(i)"
      >
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <ElInput
              v-model="concept.classCategory.value"
              label="Type of Concept"
              sub-label="The general concept you are training."
              input="InputSelectCustom"
              required
              :list="[
                { value: 'custom', name: 'Custom' },

                ...regularizationThemes,
              ]"
            />

            <ElInput
              v-show="concept.isCustomClass.value"
              v-model="concept.classToken.value"
              label="Concept Name (Class Token)"
              sub-label="What is the general name for the concept you are training? E.g. 'anime', 'dog', 'man', 'cartoon', 'car', 'flower', etc."
              input="InputText"
              required
              placeholder="person"
            />

            <ElInput
              v-show="concept.isCustomClass.value"
              v-model="concept.classDataZipUrl.value"
              label="Reference Images"
              sub-label="(Optional) Also called regularization images. They help improve quality, but are only needed for detailed concepts like people. Add a zip url."
              description="Create a folder with cropped images at 512 by 512 pixels and upload it somewhere that allows you to link it here. Limit 200MB."
              input="InputText"
              placeholder="https://example.com/images.zip"
            >
              <template #after>
                <div class="mt-2 flex space-x-4">
                  <DropDown
                    size="xs"
                    :list="regularizationThemes"
                    default-text="Use Reference Image Template"
                    max-width="240px"
                    @update:model-value="concept.loadTheme($event as string)"
                  />
                </div>
              </template>
            </ElInput>
            <ElInput
              v-show="false"
              v-model="concept.instanceToken.value"
              label="Instance Token"
              sub-label="(Usually default is fine) A token to associate with this concept. Should have no dictionary meaning."
              input="InputText"
              required
              placeholder="abcxyc"
            />
          </div>
          <ElInput
            label="Concept Images"
            sub-label="<span class='font-semibold'>Important Guidelines:</span > Use 6+ images, quality over quantity,
                  maintain consistency and reduce noise."
          >
            <InputMediaMultiple
              :handler="concept.instanceImageHandler"
              :loading="concept.loadingImages.value"
            />
          </ElInput>
        </div>
      </ElPanel>

      <div class="flex justify-center">
        <ElButton btn="default" @click="addConcept()">
          <div class="i-heroicons-plus mr-2 inline-block text-lg" />
          Add Another Concept
        </ElButton>
      </div>

      <ElPanel
        v-if="activeModel.status.value === 'ready'"
        title="Meta Information"
      >
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-12">
              <ElInput
                v-model="activeModel.description.value"
                label="Description"
                sub-label="(optional) A description of the model for reference and public listings only."
                input="InputTextarea"
                required
                :rows="6"
              />
            </div>
          </div>
        </div>
      </ElPanel>
    </div>

    <ElModal :vis="!!sending" modal-class="max-w-2xl p-12">
      <ElModalBanner
        class="items-center justify-center space-y-4 text-center"
        title="Saving Model Data"
        description="Uploading your images and data"
      >
        <template #sub>
          <ElSpinner class="text-primary-500 mt-6 inline-block h-8 w-8" />
        </template>
      </ElModalBanner>
    </ElModal>
  </AdminPage>
</template>

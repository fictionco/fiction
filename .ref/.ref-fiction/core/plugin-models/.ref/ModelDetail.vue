<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { standardDate, standardTime, vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElButton from '@factor/ui/ElButton.vue'
import AdminPage from '@factor/api/plugin-admin/AdminPage.vue'
import { useFictionApp } from '../../util'
import type { Model } from '../model'
import ElJobProgress from '../../plugin-instance/ElJobProgress.vue'
import type { TableModelConfig } from '../tables'
import { MultiImageHandler } from '../image-upload/handler'
import type { Concept } from '../templates'

const multiImageHandler = new MultiImageHandler()
const { factorRouter, factorUser, fictionModel, fictionJobs } = useFictionApp()
const loadingPage = vue.ref<string>('init')
const sending = vue.ref<boolean | string>(false)
const activeModel = vue.shallowRef<Model>()

const modelState = vue.ref('')

const routeModelId = vue.computed<string>({
  get: () => factorRouter.params.value.modelId as string,
  set: val => factorRouter.goto('renderCreate', { modelId: val as string }),
})

const activeJob = vue.computed(() => {
  const job = fictionJobs.getProcessingJob({
    progressId: routeModelId.value,
  }).value

  return job
})

vue.watch(
  () => activeJob.value,
  async (val) => {
    if (val?.outputs?.model) {
      const model = val.outputs.model as TableModelConfig
      fictionModel.log.info('updating model', { data: model })

      activeModel.value?.updateModel(model)
    }
  },
)

const statusMap = vue.computed(() => {
  const modelId = routeModelId.value
  const createLink = factorRouter.link('renderCreate', { modelId })
  const retryLink = factorRouter.link('modelRetry', { modelId })
  const m: Record<string, { href: string, btn: string, text: string }> = {
    ready: {
      href: createLink.value,
      btn: 'success',
      text: 'Ready to Render',
    },
    error: {
      href: retryLink.value,
      btn: 'danger',
      text: 'There was an error (retry?)',
    },
    processing: {
      href: '',
      btn: 'caution',
      text: 'Processing',
    },
  }
  const status = activeModel?.value?.status.value as string
  return status && m[status] ? m[status] : undefined
})
vue.onMounted(async () => {
  await factorUser.userInitialized()

  vue.watch(
    () => routeModelId.value,
    async (val) => {
      if (val) {
        const model = await fictionModel.findOne({
          id: val as string,
          table: 'model',
        })

        activeModel.value = model

        loadingPage.value = 'zip'

        if (model) {
          model.fullConceptsList.value.forEach(async (c) => {
            const zipUrl = c.instanceDataZipUrl.value

            if (zipUrl)
              await c.instanceImageHandler.addFilesFromZipUrl(zipUrl)
          })
        }

        loadingPage.value = ''
      }
    },
    { immediate: true },
  )
})

function getConceptItems(concept: Concept) {
  return [
    {
      name: 'Instance Token [c]',
      value: concept?.instanceToken.value || concept?.model.modelId,
    },
    {
      name: 'Instance Prompt',
      value: concept?.instancePrompt,
    },
    {
      name: 'Class Prompt',
      value: concept?.classPrompt,
    },
    {
      name: 'Class Token',
      value: concept.classToken.value,
    },
  ]
}

const data = vue.computed(() => {
  const activeModel = fictionModel.activeModel.value
  const templateConfig = activeModel?.templateConfig.value
  return [
    {
      name: 'Status',
      value: activeModel?.status.value,
    },
    {
      name: 'Platform',
      value: activeModel?.template.value?.templateName,
    },
    {
      name: 'Base Model',
      value: activeModel?.baseModel.value,
    },
    {
      name: 'Learning Rate',
      value: templateConfig?.learningRate,
    },
    {
      name: 'Steps',
      value: templateConfig?.maxTrainSteps,
    },

    {
      name: 'Model Id',
      value: activeModel?.modelId,
    },
  ]
})

async function updateModel(): Promise<void> {
  const modelConfig = activeModel.value?.toConfig()

  if (!modelConfig)
    throw new Error('no modelConfig')

  const r = await fictionModel.requests.ManageModel.projectRequest({
    _action: 'update',
    modelConfig,
  })

  if (r?.status === 'success')
    modelState.value = 'requested'
}

async function send(context: string): Promise<void> {
  sending.value = context

  await updateModel()

  sending.value = false
}
</script>

<template>
  <AdminPage :loading="loadingPage === 'init'">
    <ElForm @submit="send('primary')">
      <ElPanel
        v-if="activeModel"
        title="Model Details"
        :actions="
          activeModel.status.value === 'ready'
            ? [
              {
                name: 'Render from Model',
                href: factorRouter.link('renderCreate', {
                  modelId: activeModel.modelId,
                }).value,
                btn: 'primary',
              },
            ]
            : []
        "
      >
        <div class="space-y-8">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-extrabold">
                {{ activeModel.modelName.value }}
              </h2>
              <p class="text-theme-500 mt-1 text-sm">
                Created at
                {{ standardDate(activeModel.createdAt) }} at
                {{ standardTime(activeModel.createdAt) }}
              </p>
            </div>
            <div class="status flex items-center space-x-4">
              <ElButton
                btn="default"
                :href="
                  factorRouter.link('modelRetry', { modelId: routeModelId })
                    .value
                "
              >
                Request Again
              </ElButton>
              <ElButton
                v-if="statusMap"
                :btn="statusMap.btn"
                :href="statusMap.href"
              >
                <span>{{ statusMap.text }}</span>
              </ElButton>
            </div>
          </div>
          <ElJobProgress
            v-if="
              activeJob?.progressId === activeModel.modelId
                || activeJob?.progressId === 'instance'
            "
          />
          <div v-if="activeModel" class="space-y-6">
            <div
              v-if="activeModel.status.value === 'ready'"
              class="downloads space-x-4"
            >
              <ElButton
                v-if="activeModel.modelCheckpointUrl.value"
                btn="default"
                size="sm"
                :href="activeModel.modelCheckpointUrl.value"
              >
                Download Model (safetensor)
              </ElButton>
            </div>

            <div
              v-for="(concept, i) in activeModel.fullConceptsList.value"
              :key="i"
              class="border-theme-200 rounded border p-8"
            >
              <div
                class="text-theme-400 mb-3 text-sm font-bold uppercase tracking-wider"
              >
                Concept
              </div>
              <ElInput class="my-4" label="Training Images">
                <div class="my-2 grid grid-cols-8 gap-2 xl:gap-5">
                  <div
                    v-for="(item, ii) in concept.instanceImageHandler.files
                      .value"
                    :key="ii"
                  >
                    <img :src="item.url" class="rounded-md shadow-sm">
                  </div>
                </div>
              </ElInput>

              <div class="grid grid-cols-12 gap-6">
                <div
                  v-for="(item, ii) in getConceptItems(concept)"
                  :key="ii"
                  class="col-span-4"
                >
                  <dt class="text-sm font-semibold">
                    {{ item.name }}
                  </dt>
                  <dd class="text-theme-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {{ item.value }}
                  </dd>
                </div>
              </div>
            </div>
            <div class="border-theme-200 rounded border p-8">
              <div
                class="text-theme-400 mb-3 text-sm font-bold uppercase tracking-wider"
              >
                Model
              </div>
              <div class="grid grid-cols-12 gap-6">
                <div
                  v-for="(d, i) in data"
                  :key="i"
                  class="col-span-4"
                >
                  <dt class="text-sm font-semibold">
                    {{ d.name }}
                  </dt>
                  <dd class="text-theme-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {{ d.value }}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ElForm
          v-if="activeModel"
          class="space-y-6"
          @submit="send('primary')"
        >
          <div class="my-6 space-y-6">
            <div class="font-bold">
              Edit Model Details
            </div>
            <ElInput
              v-model="activeModel.modelName.value"
              label="Model Name"
              input="InputText"
              placeholder="Name the model"
              required
            />
            <ElInput
              v-model="activeModel.description.value"
              label="About Your Model"
              sub-label="Describe the unique features of this model"
              input="InputTextarea"
              placeholder="Describe the model"
            />
            <div class="text-left">
              <ElButton
                btn="default"
                type="submit"
                :loading="sending === 'primary'"
                size="md"
              >
                Save Updates
              </ElButton>
            </div>
          </div>
        </ElForm>
      </ElPanel>
    </ElForm>
  </AdminPage>
</template>

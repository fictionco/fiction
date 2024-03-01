<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import { onEvent, resetUi, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElInput from '@factor/ui/ElInput.vue'
import DropDown from '@factor/ui/DropDown.vue'
import ElInputGroup from '@factor/ui/ElInputGroup.vue'
import AdminPage from '../../plugin-admin/AdminPage.vue'
import { avatarPrompts } from '../../plugin-app-dreambooth/lib'
import { useFictionApp } from '../../util'
import { Model, Render } from '../model'
import ElJobProgress from '../../plugin-instance/ElJobProgress.vue'
import type { RenderConfig, TableRenderConfig } from '../../tables'
import ElModelSelect from './ElModelSelect.vue'
import ElRenderIndex from './ElRenderIndex.vue'

const {
  factorRouter,
  factorUser,
  fictionModel,
  fictionInstance,
  fictionUsage,
} = useFictionApp()
const sending = vue.ref<boolean | string>(false)
const loadingPage = vue.ref<boolean>(true)
const activeModel = vue.shallowRef<Model>()
const rendersConfig = vue.ref<TableRenderConfig[]>([])
const renders = vue.computed<Render[]>(() => {
  const r = rendersConfig.value
  return r.map((rc) => {
    return new Render({ ...rc, fictionModel })
  })
})
const modelDetailsVis = vue.ref<boolean>(false)
const routeModelId = vue.computed<string | undefined>({
  get: () => factorRouter.params.value.modelId as string | undefined,
  set: val => factorRouter.goto('renderCreate', { modelId: val as string }),
})

const noRemaining = vue.computed(() => {
  const u = fictionUsage.activeUsage.value
  const remainingImages = u?.remainingImages ?? 1

  return remainingImages <= 0
})

const renderConfig = vue.ref<Partial<RenderConfig>>({
  guidanceScale: 7.5,
  numOutputs: 4,
  numInferenceSteps: 70,
  aspect: 'square',
})

const conceptItems = vue.computed(() => {
  const items
    = activeModel.value?.conceptsList.value.map((c, i) => {
      return {
        text: `Concept ${i + 1} Identifying Tag`,
        value: `(${c.instanceToken} ${c.classToken}) or [c${i + 1}]`,
      }
    }) || []

  return [...items]
})

vue.watch(
  () => fictionInstance.activeJob.value,
  async (val, old) => {
    if (!val && old)
      await setRenders()
  },
)

async function requestModel(modelId: string): Promise<Model> {
  const r = await fictionModel.requests.ManageModel.request({
    _action: 'retrieve',
    modelConfig: { modelId },
  })

  if (!r.data)
    throw new Error(`no model found: ${modelId}`)

  return new Model({ fictionModel, ...r.data })
}

async function setRenderData(args: { renderConfig: Partial<RenderConfig> }) {
  renderConfig.value = { ...renderConfig.value, ...args.renderConfig }

  if (renderConfig.value.conceptTag) {
    renderConfig.value.prompt = renderConfig.value.prompt?.replace(
      renderConfig.value.conceptTag,
      '[c]',
    )
  }

  delete renderConfig.value.seed
}

// set from elsewhere...
onEvent('setRenderData', async (renderConfig: Partial<RenderConfig>) => {
  await setRenderData({ renderConfig })
})

async function setRenders() {
  await factorUser.userInitialized()

  const r = await fictionModel.requests.QueryRenders.projectRequest({
    filters: [{ field: 'status', value: 'ready', operator: '=' }],
  })

  const newData = r.data || []

  rendersConfig.value = newData

  const mostRecent = rendersConfig.value[0]

  if (!routeModelId.value && mostRecent?.modelId) {
    await factorRouter.goto('renderCreate', { modelId: mostRecent.modelId })
  }
  else if (!routeModelId.value && mostRecent?.baseModel) {
    await factorRouter.goto('renderCreate', {
      modelId: `base_${encodeURIComponent(mostRecent?.baseModel)}`,
    })
  }

  if (mostRecent)
    await setRenderData({ renderConfig: mostRecent.renderConfig })
}

vue.onMounted(async () => {
  vue.watch(
    () => factorUser.activeOrganizationId.value,
    async (val) => {
      if (val) {
        await setRenders()
        loadingPage.value = false
      }
    },
    { immediate: true },
  )

  vue.watch(
    () => routeModelId.value,
    async (val) => {
      if (val && !val.includes('base'))
        activeModel.value = await requestModel(val)
    },
    { immediate: true },
  )
})

async function createRender(): Promise<void> {
  if (!routeModelId.value)
    throw new Error('no model id')

  const addWatermark
    = !factorUser.activeOrganization.value?.config?.disableWatermark
  const c: Partial<RenderConfig> = {
    ...renderConfig.value,
    addWatermark,
  }

  await fictionModel.requests.ManageRender.projectRequest({
    _action: 'create',
    modelId: routeModelId.value,
    renderConfig: c,
  })
}

async function send(context: string): Promise<void> {
  sending.value = context

  fictionInstance.setStateLoading(5)
  await createRender()

  sending.value = false
}

function setPrompt(value: string): void {
  const prompt = avatarPrompts.find(p => p.value === value)

  if (!prompt)
    throw new Error('No prompt found')

  const conf = prompt.renderConfig

  renderConfig.value = {
    ...renderConfig.value,
    ...conf,
  }
  resetUi()
}
</script>

<template>
  <AdminPage
    :requires="['instance']"
    title="Renders"
    :loading="loadingPage"
  >
    <div class="image-container relative space-y-6">
      <ElJobProgress :progress-ids="['render', 'start']" />
      <ElRenderIndex :renders="renders" @refresh="setRenders()" />
    </div>

    <template #editor>
      <ElForm class="flex h-full flex-col" @submit="send('primary')">
        <div class="min-h-0 grow space-y-6 overflow-scroll p-6">
          <ElInput label="Selected Model">
            <ElModelSelect
              v-model="routeModelId"
              status="ready"
              required
            />
            <div
              v-if="routeModelId && routeModelId.includes('base_')"
              class="bg-theme-100 text-theme-500 mt-3 rounded-md p-2 text-xs font-medium tracking-tight"
            >
              You're using a base model. Fiction is better with
              <RouterLink
                :to="factorRouter.link('modelIndex').value"
                class="underline"
              >
                custom models
              </RouterLink>.
            </div>
          </ElInput>
          <ElInput
            v-model="renderConfig.prompt"
            label="Prompt"
            sub-label="Reference the trained concept as [c]. Describe what you'd like to see."
            input="InputTextarea"
            :prompts="avatarPrompts"
            input-class="font-mono"
            :rows="6"
            required
            placeholder="A cinematic still of [c]..."
          >
            <template #after>
              <div class="mt-2 xl:flex">
                <DropDown
                  size="xs"
                  :list="avatarPrompts"
                  default-text="Avatar Template"
                  @update:model-value="setPrompt($event as string)"
                />
                <div class="mt-2 xl:ml-4 xl:mt-0">
                  <ElButton
                    v-if="routeModelId"
                    size="xs"
                    @click.prevent="modelDetailsVis = !modelDetailsVis"
                  >
                    {{ !modelDetailsVis ? `Concept Info` : `Hide` }}
                  </ElButton>
                </div>
              </div>

              <div
                v-if="modelDetailsVis"
                class="border-theme-300 bg-theme-50 text-theme-600 mt-4 rounded-md border p-3 text-xs font-medium"
              >
                <div>
                  The token [c] is replaced during render with all concept tags.
                </div>
                <div
                  v-for="(item, i) in conceptItems"
                  :key="i"
                  class="my-2 text-xs"
                >
                  <div class="text-theme-400 text-[10px] font-bold">
                    {{ item.text }}
                  </div>
                  <div class="font-semibold">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </template>
          </ElInput>
          <ElInputGroup label="Render Settings" wrap-class="space-y-6">
            <ElInput
              v-model="renderConfig.aspect"
              label="Aspect Ratio"
              sub-label="What dimensions should the images have?"
              input="InputSelectCustom"
              :list="[
                {
                  name: 'Square',
                  desc: '512x512',
                  value: 'square',
                  isDefault: true,
                },
                { name: 'Portrait', desc: '512x768', value: 'portrait' },
                { name: 'Landscape', desc: '768x512', value: 'landscape' },
                { name: 'Wide', desc: '1024x512', value: 'wide' },
                { name: 'Tall', desc: '512x1024', value: 'tall' },
              ]"
              :rows="3"
              placeholder="A cinematic still of [c]..."
            />
            <ElInput
              v-model="renderConfig.numOutputs"
              label="Images per Render"
              sub-label="The more images, the longer it will take."
              input="InputRange"
              default-value="4"
              min="1"
              max="12"
              step="1"
            />
            <ElInput
              v-model="renderConfig.negativePrompt"
              label="Negative Prompt"
              sub-label="What would you like to avoid in the images?"
              input="InputTextarea"
              :rows="3"
            />
            <ElInput
              v-model="renderConfig.numInferenceSteps"
              label="Inference Steps"
              sub-label="How many steps should the image be refined for?"
              input="InputRange"
              default-value="70"
              min="1"
              max="300"
            />
            <ElInput
              v-model="renderConfig.guidanceScale"
              label="Guidance Scale"
              sub-label="Lower guidance for more creativity, higher for more adherence your prompt."
              input="InputRange"
              default-value="7.5"
              min="1"
              max="20"
              step="0.5"
            />
            <ElInput
              v-model="renderConfig.seed"
              label="Seed"
              sub-label="(Optional) A seed can be used to generate the same image every time."
              input="InputText"
              placeholder="1234"
            />
          </ElInputGroup>
        </div>
        <div class="border-theme-300 border-t p-6 pb-12">
          <div
            v-if="noRemaining"
            class="border-caution-300 text-caution-600 bg-caution-50 mb-4 rounded-md border p-3 text-xs font-bold"
          >
            You've used all of your available generations for the current cycle
            ({{ fictionUsage.activeUsage.value?.paidImages }}). Please upgrade
            your subscription to generate more.
          </div>
          <ElButton
            btn="primary"
            size="xl"
            format="block"
            :loading="fictionInstance.stateLoading.value"
            :animate="true"
            :disabled="noRemaining"
          >
            Generate
          </ElButton>
        </div>
      </ElForm>
    </template>
  </AdminPage>
</template>

<style lang="less">
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>

<script lang="ts" setup>
import { onResetUi, toLabel, vue, waitFor } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'
import InputCheckbox from '@fiction/ui/inputs/InputCheckbox.vue'
import type { InputOptionGeneration } from '@fiction/ui'
import ElModal from '@fiction/ui/ElModal.vue'
import ElProgress from '@fiction/ui/loaders/ElProgress.vue'
import ElBadge from '@fiction/ui/common/ElBadge.vue'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import type { Site } from '../site'
import type { Card } from '../card'
import AiSettings from './AiSettings.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  site: { type: Object as vue.PropType<Site>, default: () => ({}) },
})

const loading = vue.ref(false)
const card = vue.computed<Card | undefined>(() => props.site.activeCard.value)
const genUtil = vue.computed(() => card.value?.genUtil)

const completion = vue.ref<Record<string, unknown>>()
const accept = vue.ref<Record<string, boolean>>({})
async function generateCard() {
  loading.value = true
  completion.value = await genUtil.value?.getCompletion()
  loading.value = false
}

vue.watch(() => completion.value, () => {
  const c = completion.value
  accept.value = {}
  if (c && Object.keys(c).length) {
    Object.entries(c).forEach(([key]) => {
      accept.value = { ...accept.value, [key]: true }
    })
  }
})

const finalCompletion = vue.computed(() => completion.value && Object.fromEntries(Object.entries(completion.value).filter(([key]) => accept.value[key])))

function updateGeneration(opt: InputOptionGeneration, value: InputOptionGeneration) {
  if (!opt.key || !card.value)
    return

  card.value.genUtil.userPropConfig.value = { ...genUtil.value?.userPropConfig.value, [opt.key]: { ...opt, ...value } }
}

const vis = vue.ref(false)
const editField = vue.ref<string | undefined>()

onResetUi(() => {
  editField.value = undefined
})

async function applyChanges() {
  if (!card.value || !genUtil.value)
    return

  loading.value = true
  await waitFor(500)

  card.value.genUtil.applyChanges(finalCompletion.value)
  loading.value = false
  vis.value = false
  completion.value = undefined
}

const selectedTab = vue.ref<'card' | 'site'>('card')

const fieldClasses = `font-sans antialiased capitalize inline-block inline-flex items-center rounded-md bg-theme-100/yo dark:bg-theme-600/50 dark:text-theme-400 text-theme-500 px-2 py-0.5 cursor-pointer hover:opacity-70`
</script>

<template>
  <div v-if="card" class="space-y-3">
    <div class="flex justify-between">
      <div class="flex items-center">
        <XButton
          type="submit"
          theme="primary"
          wrap-class="gap-1"
          size="xs"
          :loading="loading"
          icon="i-tabler-sparkles"
          rounding="full"
          @click.stop="vis = !vis"
        >
          Generate Content...
        </XButton>
      </div>

      <div class="flex items-center space-x-2" />
    </div>

    <ElModal v-model:vis="vis" modal-class="max-w-screen-sm p-12">
      <div v-if="!loading" class="flex gap-4 mb-6">
        <ElBadge icon="i-tabler-input-ai" href="#" :theme="selectedTab === 'card' ? 'blue' : 'theme'" @click.prevent="selectedTab = 'card'">
          Card
        </ElBadge>
        <ElBadge icon="i-tabler-file-text-ai" href="#" :theme="selectedTab === 'site' ? 'blue' : 'theme'" @click.prevent="selectedTab = 'site'">
          Site
        </ElBadge>
      </div>
      <TransitionSlide>
        <div v-if="selectedTab === 'site'" class=" space-y-6">
          <div class="py-6">
            <h2 class="font-semibold text-lg x-font-title">
              Website AI Settings
            </h2>
            <AiSettings :site="site" />
          </div>
        </div>
        <div v-else>
          <div v-if="completion" class="space-y-6 max-w-xl mx-auto">
            <h2 class="font-semibold text-lg x-font-title ">
              Accept Generated Content
            </h2>
            <div class="space-y-2">
              <div v-for="(field, key) in completion" :key="key" class="flex gap-8 border bg-theme-50 dark:bg-theme-700 rounded-md border-theme-200 dark:border-theme-600/70 p-4">
                <div class="font-semibold text-xs w-20 text-right shrink-0 text-theme-400 dark:text-theme-500">
                  {{ toLabel(key) }}
                </div>
                <div class="text-sm grow">
                  <div v-if="typeof field === 'object' && (field as Record<string, any>)?.url" class="">
                    <img class="max-h-[10em]" :src="(field as Record<string, any>)?.url">
                  </div>
                  <div v-else>
                    {{ field }}
                  </div>
                </div>
                <div class="text-xs">
                  <InputCheckbox :model-value="accept[key]" text="Accept?" input-class="bg-theme-0 dark:bg-theme-600" @update:model-value="accept = { ...accept, [key]: $event }" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between mt-6">
              <XButton
                theme="default"
                size="md"
                icon="i-tabler-chevron-left"
                rounding="full"
                @click="completion = undefined"
              >
                Discard Changes
              </XButton>
              <XButton
                theme="primary"
                size="md"
                :loading="loading"
                icon="i-tabler-sparkles"
                @click="applyChanges()"
              >
                Apply
              </XButton>
            </div>
          </div>
          <div v-else-if="!loading" class="space-y-6 max-w-screen-sm">
            <h2 class="font-semibold text-lg x-font-title">
              Generate Content for {{ card?.title }} Card
            </h2>
            <ElForm v-if="card && genUtil" class="space-y-3" @submit="generateCard()">
              <div class="space-y-4 mt-2 bg-theme-50 dark:bg-theme-700 rounded-md p-8">
                <div class="flex flex-col gap-2" @click.stop>
                  <div class="font-semibold">
                    Prompt
                  </div>
                  <div class="grow text-sm">
                    <div v-if="editField !== 'card'" :class="fieldClasses" @click="editField = 'card'">
                      <span class="i-tabler-pencil mr-1 text-base" /><span class="grow">{{ genUtil?.prompt.value }}</span>
                    </div>
                    <div v-else>
                      <ElInput
                        v-if="card && genUtil"
                        :site="site"
                        label="Generation Prompt"
                        description="Enter a sentence or two about what you wan t to achieve with this card. Contextual information will be added automatically."
                        :model-value="genUtil.prompt.value"
                        input="InputTextarea"
                        placeholder="This section should..."
                        @update:model-value="genUtil && (genUtil.userPrompt.value = $event)"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex justify-between">
                  <div class="text-xs font-medium text-center">
                    Fields to Generate <span class="text-xs opacity-50 text-theme-500">( {{ genUtil.totalEstimatedTime.value }} seconds)</span>
                  </div>
                </div>
                <div v-for="(opt, key) in genUtil?.jsonPropConfig.value" :key="key" class="text-[10px] space-y-1">
                  <div class="flex gap-1 items-center">
                    <div class="">
                      <InputCheckbox :id="`opt-${key}`" :model-value="opt.isEnabled" input-class="bg-theme-0 dark:bg-theme-600" @update:model-value="updateGeneration(opt, { isEnabled: $event })" />
                    </div>
                    <label :for="`opt-${key}`" class="w-24 truncate font-semibold cursor-pointer select-none">
                      {{ toLabel(opt.label) }}
                    </label>
                    <div class="grow" @click.stop>
                      <div v-if="editField !== opt.key" :class="fieldClasses" @click.stop="editField = opt.key">
                        <span class="i-tabler-pencil mr-1 text-xs" /><span class="grow">{{ opt.prompt || 'Edit Field Description' }}</span>
                      </div>
                      <InputText v-else input-class="text-xs" :model-value="opt.prompt" placeholder="Desired Output" @update:model-value="updateGeneration(opt, { prompt: $event })" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div />
                <XButton
                  type="submit"
                  theme="primary"
                  wrap-class="gap-1"
                  size="md"
                  :loading="loading"
                  icon="i-tabler-sparkles"
                  :disabled="!Object.keys(genUtil?.outputProps.value).length"
                  rounding="full"
                >
                  Generate Content...
                </XButton>
              </div>
            </ElForm>
          </div>
          <ElProgress v-else :percent="genUtil?.progress.value.percent" :status="genUtil?.progress.value.status" message="Generating Content" />
        </div>
      </TransitionSlide>
    </ElModal>
  </div>
</template>

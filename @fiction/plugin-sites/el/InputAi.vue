<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import InputText from '@fiction/ui/InputText.vue'
import InputCheckbox from '@fiction/ui/InputCheckbox.vue'
import type { Site } from '@fiction/plugin-sites'
import type { InputOptionGeneration } from '@fiction/ui'
import TransitionSlide from '@fiction/ui/TransitionSlide.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElProgress from '@fiction/ui/ElProgress.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  site: { type: Object as vue.PropType<Site>, default: () => ({}) },
})

const loading = vue.ref(false)
const card = vue.computed(() => props.site.activeCard.value)

async function generateCard() {
  loading.value = true
  await card.value?.generation.getCompletion()
  loading.value = false
}

const showAdvancedOptions = vue.ref(false)

function updateGeneration(opt: InputOptionGeneration, value: InputOptionGeneration) {
  if (!opt.key || !card.value)
    return

  card.value.generation.userInputConfig.value = {
    ...card.value?.generation.userInputConfig.value,
    [opt.key]: { ...opt, ...value },
  }
}

const numFields = vue.computed(() => {
  return Object.values(card.value?.generation.inputConfig.value || {}).filter(_ => !_.isDisabled).length
})
</script>

<template>
  <ElForm v-if="card" class="space-y-3" @submit="generateCard()">
    <div class="flex justify-between">
      <div class="flex items-center">
        <ElButton
          type="submit"
          btn="primary"
          wrap-class="gap-1"
          size="xs"
          :loading="loading"
        >
          <span class="i-tabler-sparkles text-base" />
          <span>Generate ({{ numFields }})</span>
        </ElButton>
      </div>

      <div class="flex items-center space-x-2">
        <ElButton
          btn="default"
          size="xs"
          tag="div"
          wrap-class="gap-1 cursor-pointer"
          @click="showAdvancedOptions = !showAdvancedOptions"
        >
          <span>AI Config</span>
          <span class="i-tabler-settings text-base transition-all" :class="showAdvancedOptions ? '' : 'rotate-180'" />
        </ElButton>
        <ElButton
          btn="default"
          size="xs"
          tag="div"
          wrap-class="gap-1 cursor-pointer"
          @click.stop="site.fictionSites.useTool({ toolId: 'ai' })"
        >
          <span class="i-tabler-world text-base" />
        </ElButton>
      </div>
    </div>

    <TransitionSlide>
      <div v-if="showAdvancedOptions" class="space-y-3">
        <ElInput
          v-bind="$attrs"
          label="Overall Generation Goal"
          description="Enter a sentence or two about what you want to achieve with this card. Contextual information will be added automatically."
          :model-value="card.generation.prompt.value"
          input="InputTextarea"
          placeholder="This section should..."
          @update:model-value="card.generation.userPrompt.value = $event"
        />
        <div class="space-y-2 mt-2 bg-theme-50 dark:bg-theme-700 rounded-md p-3">
          <div class="flex justify-between">
            <div class="text-xs font-bold text-theme-500/80 text-center">
              Setting Prompts
            </div>
            <div class="text-xs font-bold text-theme-500/80">
              {{ card?.generation.totalEstimatedTime.value }} seconds
            </div>
          </div>
          <div v-for="(opt, key) in card?.generation.inputConfig.value" :key="key" class="text-[10px] space-y-1">
            <div class="flex items-center justify-between">
              <div class="w-24 truncate font-semibold">
                {{ opt.label }}
              </div>
              <div class="">
                <InputCheckbox :model-value="opt.isDisabled" input-class="bg-theme-0 dark:bg-theme-600" text="Disable" @update:model-value="updateGeneration(opt, { isDisabled: $event })" />
              </div>
            </div>
            <div v-if="!opt.isDisabled" class="grow w-full">
              <InputText input-class="text-xs" :model-value="opt.prompt" placeholder="Desired Output" @update:model-value="updateGeneration(opt, { prompt: $event })" />
            </div>
          </div>
        </div>
      </div>
    </TransitionSlide>

    <ElModal :vis="loading">
      <ElProgress :percent="card.generation.progress.value.percent" :status="card.generation.progress.value.status" message="Generating Content" />
    </ElModal>
  </ElForm>
</template>

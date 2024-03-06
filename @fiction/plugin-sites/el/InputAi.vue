<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import InputText from '@fiction/ui/InputText.vue'
import InputCheckbox from '@fiction/ui/InputCheckbox.vue'
import type { Site } from '@fiction/plugin-sites'
import type { InputOption, InputOptionSettings } from '@fiction/ui'

const props = defineProps({
  modelValue: { type: String, default: '' },
  site: { type: Object as vue.PropType<Site>, default: () => ({}) },
})

const userGoal = vue.ref('')
const defaultGoal = vue.computed(() => {
  const c = props.site.activeCard.value
  const p = props.site.currentPage.value
  const pageName = p?.title.value ? `on the "${p.title.value}" page` : ''
  return `create content for the "${c?.title.value || toLabel(c?.templateId.value)}" card ${pageName}`
})

const v = vue.computed(() => userGoal.value || defaultGoal.value)

const loading = vue.ref(false)
const card = vue.computed(() => props.site.activeCard.value)

const cardOptions = vue.computed(() => {
  const getOptions = (opts: InputOption[]) => {
    let out: InputOption[] = []
    for (const opt of opts) {
      if (opt.input.value === 'group')
        out = [...out, ...getOptions(opt.settings.options || [])]
      else
        out.push(opt)
    }
    return out
  }

  return getOptions(card.value?.tpl.value?.settings.options || []).filter(_ => _.outputSchema.value)
})

const totalEstimatedTime = vue.computed(() => {
  const total = cardOptions.value.filter(_ => !_.generation.value.isDisabled).reduce((acc, opt) => {
    const time = opt.generation.value?.estimatedMs ?? 2000
    return acc + time
  }, 0)
  return Math.round(total / 1000)
})

async function generateCard() {
  loading.value = true
  const runPrompt = v.value
  if (!runPrompt)
    return

  await card.value?.getCompletion({ runPrompt })
  loading.value = false
}

const showAdvancedOptions = vue.ref(false)

function updateGeneration(opt: InputOption, value: InputOptionSettings['generation']) {
  opt.generation.value = { ...opt.generation.value, ...value }
}
</script>

<template>
  <ElForm class="space-y-3" @submit="generateCard()">
    <div class="flex justify-between">
      <ElButton
        type="submit"
        btn="primary"
        wrap-class="gap-1"
        size="xs"
        :loading="loading"
      >
        <span class="i-tabler-sparkles text-base" />
        <span>Generate Content</span>
      </ElButton>

      <ElButton
        btn="default"
        size="xs"
        tag="div"
        wrap-class="gap-1"
        @click="showAdvancedOptions = !showAdvancedOptions"
      >
        <span>AI Config</span>
        <span class="i-tabler-chevron-up text-base transition-all" :class="showAdvancedOptions ? '' : 'rotate-180'" />
      </ElButton>
    </div>
    <div v-if="showAdvancedOptions" class="space-y-3">
      <ElInput
        v-bind="$attrs"
        label="Overall Generation Goal"
        description="Enter a sentence or two about what you want to achieve with this card. Contextual information will be added automatically."
        :model-value="v"
        input="InputTextarea"
        placeholder="This section should..."
        @update:model-value="userGoal = $event"
      />
      <div v-if="cardOptions" class="space-y-2 mt-2 bg-theme-50 dark:bg-theme-700 rounded-md p-3">
        <div class="flex justify-between">
          <div class="text-xs font-bold text-theme-500/80 text-center">
            Setting Prompts
          </div>
          <div class="text-xs font-bold text-theme-500/80">
            {{ totalEstimatedTime }} seconds
          </div>
        </div>
        <div v-for="(opt, i) in cardOptions" :key="i" class="text-[10px] space-y-1">
          <div class="flex items-center justify-between">
            <div class="w-24 truncate font-semibold">
              {{ opt.label.value }}
            </div>
            <div class="">
              <InputCheckbox :model-value="opt.generation.value.isDisabled" input-class="bg-theme-0 dark:bg-theme-600" text="Disable" @update:model-value="updateGeneration(opt, { isDisabled: $event })" />
            </div>
          </div>
          <div v-if="!opt.generation.value.isDisabled" class="grow w-full">
            <InputText :model-value="opt.generation.value.prompt" placeholder="Desired Output" @update:model-value="updateGeneration(opt, { prompt: $event })" />
          </div>
        </div>
      </div>
    </div>
  </ElForm>
</template>

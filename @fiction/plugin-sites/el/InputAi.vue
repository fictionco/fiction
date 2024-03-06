<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import InputText from '@fiction/ui/InputText.vue'
import InputCheckbox from '@fiction/ui/InputCheckbox.vue'
import type { Site } from '@fiction/plugin-sites'

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

async function generateCard() {
  loading.value = true
  const runPrompt = v.value
  if (!runPrompt)
    return

  await props.site.activeCard.value?.getCompletion({ runPrompt })
  loading.value = false
}

const jsonSchema = vue.computed(() => {
  const c = props.site.activeCard.value
  return c?.tpl.value?.jsonSchema.value
})

const showAdvancedOptions = vue.ref(false)
</script>

<template>
  <ElForm v-if="jsonSchema" class="space-y-3" @submit="generateCard()">
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
      <div class="space-y-2 mt-2 bg-theme-50 dark:bg-theme-700 rounded-md p-3">
        <div class="text-xs font-bold text-theme-500/60 text-center">
          Setting Generation Controls
        </div>
        <div v-for="(prop, i) in jsonSchema.properties" :key="i" class="text-[10px] space-y-1">
          <div class="flex items-center">
            <div class="w-6">
              <InputCheckbox :model-value="true" input-class="bg-theme-0 dark:bg-theme-600" />
            </div>
            <div class="w-24 truncate font-semibold">
              {{ toLabel(i.split('.').pop()) }}
            </div>
          </div>
          <div class="grow w-full">
            <InputText :model-value="prop.description" placeholder="Desired Output" />
          </div>
        </div>
      </div>
    </div>
  </ElForm>
</template>

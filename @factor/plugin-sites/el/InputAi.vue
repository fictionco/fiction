<script lang="ts" setup>
import { toLabel, vue } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { Site } from '@factor/plugin-sites'

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
</script>

<template>
  <ElForm class="space-y-3" @submit="generateCard()">
    <ElInput
      v-bind="$attrs"
      label="Content Generation Goal"
      description="Enter a sentence or two about what you want to achieve with this card. Contextual information will be added automatically."
      :model-value="v"
      input="InputTextarea"
      placeholder="This section should..."
      @update:model-value="userGoal = $event"
    />

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
  </ElForm>
</template>

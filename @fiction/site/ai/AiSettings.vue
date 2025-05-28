<script lang="ts" setup>
import type { Site } from '../../site'
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
})
const loading = vue.ref(false)

const options: InputOption[] = [
  new InputOption({
    key: 'aiContentSettings',
    label: 'AI Content Generation',
    input: 'group',
    options: [
      new InputOption({
        key: 'userConfig.ai.objectives.about',
        label: 'About the Website',
        description: 'The primary focus for the website? Who or what is it about?',
        input: 'InputTextarea',
        placeholder: 'A portfolio website for a freelance web designer...',
        props: { rows: 3 },
      }),
    ],
  }),

]

async function save() {
  loading.value = true

  await props.site.save()

  loading.value = false
}
</script>

<template>
  <ElForm class="space-y-6" @submit="save()">
    <FormEngine
      state-key="aiSettings"
      :model-value="site.toConfig()"
      :options
      :input-props="{ site }"
      :depth="0"
      @update:model-value="site.update($event, { caller: 'updateGlobalSettings' })"
    />

    <div class="text-right px-4 py-2">
      <ElInput input="InputSubmit" :loading="loading">
        Save AI Settings
      </ElInput>
    </div>
  </ElForm>
</template>

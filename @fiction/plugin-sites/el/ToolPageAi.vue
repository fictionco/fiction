<script lang="ts" setup>
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import type { Site } from '../site'
import { imageStyle } from '../util'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'
import ToolForm from './ToolForm.vue'

const props = defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    required: true,
  },
  tool: {
    type: Object as vue.PropType<EditorTool>,
    required: true,
  },
  saveText: {
    type: String,
    default: 'Save',
  },
})
const loading = vue.ref(false)

const options = [
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
      new InputOption({
        key: 'userConfig.ai.objectives.targetCustomer',
        label: 'Target Customer',
        description: 'Who is the target customer(s) for the website? What are their needs?',
        input: 'InputTextarea',
        placeholder: 'Small business owners in need of a professional website.',
        props: { rows: 3 },
      }),

    ],
  }),
  new InputOption({
    key: 'aiImageSettings',
    label: 'AI Image Generation',
    input: 'group',
    options: [
      new InputOption({
        key: 'userConfig.ai.objectives.imageStyle',
        label: 'Image Style',
        input: 'InputSelectCustom',
        list: imageStyle,
      }),
      new InputOption({
        key: 'userConfig.ai.objectives.imageStyle',
        label: 'Image Style',
        description: 'When generating placeholder images for your site, what style would be best?',
        input: 'InputTextarea',
        placeholder: 'realistic, highly professional',
        props: { rows: 3 },
      }),
    ],
  }),
  // new InputOption({
  //   key: 'aiAdvanced',
  //   label: 'Advanced AI Settings',
  //   input: 'group',
  //   options: [
  //     new InputOption({
  //       key: 'userConfig.baseInstruction',
  //       label: 'Base Instruction',
  //       description: 'This is the base instruction given to the AI when generating content.',
  //       input: 'InputTextarea',
  //       props: { rows: 3 },
  //     }),

  //   ],
  // }),

]

async function save() {
  loading.value = true

  await props.site.save()

  loading.value = false
}
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <div class="p-4 text-xs italic text-theme-500">
      This information helps AI create more relevant and useful content for your website.
    </div>
    <ElForm @submit="save()">
      <ToolForm
        :model-value="site.toConfig()"
        :options="options"
        :site="site"
        @update:model-value="site.update($event)"
      />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading="loading">
          {{ saveText }}
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>

<style lang="less" scoped>
.region-setting-input {
  --input-bg: theme('colors.theme.100');
}
</style>

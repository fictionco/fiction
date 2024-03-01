<script lang="ts" setup>
import InputCustomSelect from '@factor/ui/InputSelectCustom.vue'
import type { ListItem } from '@factor/api'
import { vue } from '@factor/api'
import type { Prompt } from '../../plugin-app-dreambooth/lib'

const props = defineProps({
  prompts: { type: Array as vue.PropType<Prompt[]>, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

vue.onMounted(async () => {})

const list = vue.computed<ListItem[]>(() => {
  return props.prompts.map((prompt) => {
    return {
      name: prompt.name,
      value: prompt.value,
      desc: prompt.renderConfig.prompt,
      images: prompt.images,
    }
  })
})

function emitPrompt(value: string) {
  const prompt = props.prompts.find(p => p.value === value)
  emit('update:modelValue', prompt)
}
</script>

<template>
  <InputCustomSelect
    :list="list"
    default-text="Select"
    @update:model-value="emitPrompt($event)"
  >
    <template #avatar="{ item }">
      <div v-if="item && item.images" class="flex shrink-0 -space-x-2">
        <img
          v-for="src in (item.images as string[])?.slice(0, 3)"
          :key="src"
          :src="src"
          class="inline-block h-8 w-8 rounded-full bg-white ring-2 ring-white"
        >
      </div>
      <div v-else>
        <div class="i-carbon-chat text-theme-500 text-2xl" />
      </div>
    </template>
  </InputCustomSelect>
</template>

<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import type { Site } from '@fiction/site'
import { toLabel, vue } from '@fiction/core'
import InputSelectCustom from './InputSelectCustom.vue'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Select or enter URL...' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
  site: { type: Object as vue.PropType<Site>, default: undefined },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void

}>()

const showMenu = vue.ref(false)
const mode = vue.ref<'select' | 'custom'>('select')
const customPath = vue.ref('')

const sitePages = vue.computed(() => {
  const pg = props.site?.pages?.value
    .filter(p => !p.isSystem.value)
    .map(p => ({
      label: p.title.value || toLabel(p.slug.value),
      value: `/${p.slug.value === '_home' ? '' : p.slug.value}`,
    })) || []

  return [
    ...pg,
    { label: 'Add New Page', value: 'new' },
  ]
})

function handleSelect(path: string) {
  if (path === 'new') {
    props.site?.editorActivateTool({ toolId: 'addPage' })
  }
  else {
    emit('update:modelValue', path)
  }
  showMenu.value = false
}

function toggleMode() {
  mode.value = mode.value === 'select' ? 'custom' : 'select'
  emit('update:modelValue', '')
  customPath.value = ''
}

function handleCustomInput(target: EventTarget | null) {
  const value = (target as HTMLInputElement)?.value || ''
  customPath.value = value
  emit('update:modelValue', value)
}

vue.onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.route-input')) {
      showMenu.value = false
    }
  })
})
</script>

<template>
  <div class="route-input relative">
    <div v-if="mode === 'select'" class="relative">
      <InputSelectCustom :list="sitePages" @update:model-value="($event) => handleSelect($event as string)" />
    </div>

    <div v-else class="flex gap-2">
      <input
        type="url"
        :value="customPath"
        :class="textInputClasses({ inputClass, uiSize })"
        :placeholder="placeholder"
        @input="handleCustomInput($event.target)"
      >
      <div class="i-tabler-external-link text-lg text-theme-400 mt-2" />
    </div>

    <button
      type="button"
      class="mt-1 text-sm text-theme-500"
      @click="toggleMode"
    >
      {{ mode === 'select' ? 'Enter custom URL instead' : 'Select from pages instead' }}
    </button>
  </div>
</template>

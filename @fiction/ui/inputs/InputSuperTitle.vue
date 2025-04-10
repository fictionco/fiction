<script lang="ts" setup>
import type { StandardSize, SuperTitle } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import ElInput from './ElInput.vue'
import InputText from './InputText.vue'

defineOptions({ name: 'InputSuperTitle' })

const props = defineProps<{
  modelValue?: SuperTitle
  editPath?: string
  activePath?: string
  placeholder?: string
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SuperTitle): void
  (e: 'update:activePath', value: string): void
}>()

// Initialize with defaults if needed
const superTitle = vue.reactive<SuperTitle>({
  text: '',
  theme: 'primary',
  ...props.modelValue,
})

// Sync changes between local state and props
vue.watch(() => props.modelValue, (newValue) => {
  if (newValue)
    Object.assign(superTitle, newValue)
}, { deep: true })

// Options panel visibility
const showOptions = vue.ref(false)

// Handle field updates
function updateField<K extends keyof SuperTitle>(key: K, value: SuperTitle[K]) {
  superTitle[key] = value
  emit('update:modelValue', { ...superTitle })
}

function handleActivePath(path: string) {
  emit('update:activePath', path)
}

function toggleOptions() {
  showOptions.value = !showOptions.value
}
</script>

<template>
  <div class="space-y-3">
    <!-- Main text input with options toggle -->
    <div class="flex gap-2">
      <InputText
        class="flex-1"
        :model-value="superTitle.text"
        input="InputText"
        :ui-size="uiSize"
        :placeholder="placeholder || 'Enter text...'"
        :edit-path="`${editPath}.text`"
        :active-path="activePath"
        @update:model-value="updateField('text', $event)"
        @update:active-path="handleActivePath"
      />

      <XButton
        theme="default"
        rounding="md"
        :ui-size="uiSize"
        icon="i-tabler-chevron-down"
        aria-label="Show more options"
        @click="toggleOptions"
      />
    </div>

    <!-- Expandable options -->
    <div v-if="showOptions" class="mt-2 p-4 rounded-md bg-theme-800/60 space-y-3">
      <ElInput
        :model-value="superTitle.icon"
        label="Icon"
        input="InputIcon"
        :ui-size="uiSize"
        :edit-path="`${editPath}.icon`"
        :active-path="activePath"
        @update:model-value="updateField('icon', $event)"
        @update:active-path="handleActivePath"
      />

      <ElInput
        :model-value="superTitle.theme"
        label="Theme"
        input="InputColorTheme"
        :ui-size="uiSize"
        :edit-path="`${editPath}.theme`"
        :active-path="activePath"
        @update:model-value="updateField('theme', $event)"
        @update:active-path="handleActivePath"
      />

      <ElInput
        :model-value="superTitle.href"
        label="Link"
        input="InputSiteRoute"
        :ui-size="uiSize"
        :edit-path="`${editPath}.href`"
        :active-path="activePath"
        @update:model-value="updateField('href', $event)"
        @update:active-path="handleActivePath"
      />
    </div>
  </div>
</template>

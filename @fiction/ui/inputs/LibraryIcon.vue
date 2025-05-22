<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { IconCategory, IconName } from '@fiction/ui/lib/systemIcons'
import { vue } from '@fiction/core'
import { recommendedIcons } from '@fiction/ui/lib/systemIcons'
import XIcon from '../media/XIcon.vue'
import ElInput from './ElInput.vue'

defineOptions({ name: 'LibraryIcon' })

defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

const filter = vue.ref('')
const selectedCategory = vue.ref<IconCategory | 'all'>('all')

// Get unique categories from recommendedIcons
const categories = vue.computed(() => {
  const cats = new Set(recommendedIcons.map(icon => icon.category))
  const all = ['all', ...Array.from(cats)] as const
  return all.map(cat => ({ label: cat, value: cat }))
})

// Filter icons based on search text and category
const filteredIcons = vue.computed(() => {
  const searchTerm = filter.value.toLowerCase()
  return recommendedIcons.filter((icon) => {
    const matchesSearch = icon.class.replace('i-tabler-', '').toLowerCase().includes(searchTerm)
    const matchesCategory = selectedCategory.value === 'all' || icon.category === selectedCategory.value
    return matchesSearch && matchesCategory
  }).map(icon => icon.class.replace('i-tabler-', '')) as IconName[]
})

function selectIcon(iconId: IconName) {
  emit('update:modelValue', { iconId, format: 'icon' })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search and Category Filter -->
    <div class="flex gap-4">
      <ElInput
        v-model="filter"
        class="w-full basis-1/2 "
        label="Filter Icons"
        placeholder="Search icons..."
        input="InputText"
        ui-size="md"
      />
      <ElInput
        class="w-full basis-1/2 "
        label="Categories"
        input="InputSelect"
        :list="categories"
        :model-value="selectedCategory"
        ui-size="md"
        @update:model-value="selectedCategory = $event"
      />
    </div>

    <!-- Icons Grid -->
    <div
      class="p-4 grid grid-cols-8 gap-4 max-h-[300px] overflow-y-auto rounded-lg border border-theme-200 dark:border-theme-800 no-scrollbar"
    >
      <button
        v-for="iconId in filteredIcons"
        :key="iconId"
        class="flex flex-col items-center justify-center p-2 rounded hover:bg-theme-100 dark:hover:bg-theme-800 min-w-0 group transition-colors"
        :title="iconId"
        @click="selectIcon(iconId)"
      >
        <XIcon
          :media="{ format: 'icon', iconId }"
          class="size-8 text-theme-600 group-hover:text-theme-900 dark:text-theme-400 dark:group-hover:text-theme-100 transition-colors"
        />
        <span
          class="mt-1 text-[11px] truncate w-full text-center text-theme-500 group-hover:text-theme-700 dark:group-hover:text-theme-300"
        >
          {{ iconId }}
        </span>
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredIcons.length === 0"
      class="p-8 text-center text-theme-500 dark:text-theme-400"
    >
      No icons found matching your search
    </div>
  </div>
</template>

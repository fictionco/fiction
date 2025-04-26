<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { onResetUi, vue } from '@fiction/core'

const { card } = defineProps<{
  title?: string
  card: Card
}>()

const editDropdownVisible = vue.ref(false)

const editDropdownItems = vue.computed(() => {
  const items: NavListItem[] = [
    {
      value: 'edit',
      onClick: () => {
        card?.site?.setActiveCard({ cardId: card.cardId })
      },
    },
    {
      label: 'Add/Move',
      value: 'add',
      onClick: () => {
        card.site?.editorActivateTool({ toolId: 'sectionsLayout' })
      },
    },
    {
      value: 'delete',
      onClick: () => {
        card.site?.removeCard({ cardId: card.cardId })
      },
    },
  ] as const

  return items
})

function handleEditDropdownClick(args: { item: NavListItem, event: MouseEvent }) {
  const { item, event } = args
  editDropdownVisible.value = false

  item.onClick?.({ item, event })
}

onResetUi(() => {
  editDropdownVisible.value = false
})
</script>

<template>
  <div
    class="z-40 flex flex-col items-end justify-center transition-all  hover:z-20 cursor-pointer font-sans text-sm gap-0.5"
    @click.stop="editDropdownVisible = !editDropdownVisible"
  >
    <div class="flex items-center gap-1 px-2 py-0.5 text-blue-100 bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600/80 rounded-md select-none">
      <div>{{ card.tpl.value?.settings.title || 'Tools' }}</div>
      <div class="i-tabler-chevron-down" />
    </div>
    <div
      v-if="editDropdownVisible"
      class="dd top-full mt-2 w-full bg-blue-500 dark:bg-blue-600/60 rounded-md overflow-hidden"
    >
      <div
        v-for="(item, i) in editDropdownItems"
        :key="i"
        class="py-1 px-2 hover:bg-blue-600 dark:hover:bg-blue-700 capitalize cursor-pointer"
        @click.stop="handleEditDropdownClick({ item, event: $event })"
      >
        {{ item.label || item.value }}
      </div>
    </div>
  </div>
</template>

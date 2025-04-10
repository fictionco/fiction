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
      onClick: () => {},
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
  card?.site?.setActiveCard({ cardId: card.cardId })
  item.onClick?.({ item, event })
}

onResetUi(() => {
  editDropdownVisible.value = false
})
</script>

<template>
  <div
    class="z-40 transition-all bg-blue-500 dark:bg-blue-600/60 dark:hover:bg-blue-600/80 hover:z-20 cursor-pointer py-[1px] px-1.5 text-blue-100 font-sans text-xs  flex gap-0.5 items-center justify-center rounded-md"
    @click.stop="editDropdownVisible = !editDropdownVisible"
  >
    <div>{{ card.tpl.value?.settings.title || 'Tools' }}</div>
    <div class="i-tabler-chevron-down" />
    <div
      v-if="editDropdownVisible"
      class="dd absolute top-full mt-2 w-full bg-blue-500 dark:bg-blue-600/60 rounded-md"
    >
      <div
        v-for="(item, i) in editDropdownItems"
        :key="i"
        class="py-1 px-1.5 hover:bg-blue-600 dark:hover:bg-blue-700 capitalize cursor-pointer"
        @click.stop="handleEditDropdownClick({ item, event: $event })"
      >
        {{ item.label || item.value }}
      </div>
    </div>
  </div>
</template>

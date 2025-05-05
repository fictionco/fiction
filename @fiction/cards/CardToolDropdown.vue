<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { onResetUi, vue } from '@fiction/core'
import { moveCard } from '@fiction/site/utils/layout'

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
      label: 'Move Up',
      value: 'moveUp',
      onClick: () => {
        moveCard({ card, direction: 'up' })
      },
    },
    {
      label: 'Move Down',
      value: 'moveDown',
      onClick: () => {
        moveCard({ card, direction: 'down' })
      },
    },
    {
      value: 'delete',
      onClick: () => {
        const confirmed = confirm('Are you sure?')
        if (confirmed)
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
    <div class="flex items-center gap-1 px-2 py-0.5 text-primary-100 bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600/80 rounded-md select-none">
      <div>{{ card.tpl.value?.settings.title || 'Tools' }}</div>
      <div class="i-tabler-chevron-down" />
    </div>
    <div
      v-if="editDropdownVisible"
      class="dd top-full mt-2 w-full bg-primary-500 dark:bg-primary-600/60 rounded-md overflow-hidden"
    >
      <div
        v-for="(item, i) in editDropdownItems"
        :key="i"
        class="py-1 px-2 hover:bg-primary-600 dark:hover:bg-primary-700 capitalize cursor-pointer"
        @click.stop="handleEditDropdownClick({ item, event: $event })"
      >
        {{ item.label || item.value }}
      </div>
    </div>
  </div>
</template>

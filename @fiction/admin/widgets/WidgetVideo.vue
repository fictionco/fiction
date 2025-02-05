<script lang="ts" setup>
import type { Widget } from '@fiction/admin/dashboard/widget'
import type { NavItem } from '@fiction/core'
import type { Card } from '@fiction/platform'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

const { widget, card } = defineProps<{
  widget: Widget
  card: Card
}>()

const items: NavItem[] = [

  {
    title: 'Write Your First Post',
    href: card.link('/posts?addNew=1'),
    media: { format: 'iconClass', class: 'i-tabler-pencil' },
  },
  {
    title: 'Create A Site',
    href: card.link('/sites?addNew=1'),
    media: { format: 'iconClass', class: 'i-tabler-layout' },
  },
]
</script>

<template>
  <WidgetWrap :widget class="pt-4">
    <div v-for="(item, i) in items" :key="i">
      <a
        :href="item.href"
        class="flex items-center justify-between px-3 py-2 font-medium text-sm rounded-lg transition-all hover:bg-theme-100/10 dark:hover:bg-theme-700/50"
      >
        <div class="flex items-center gap-4">
          <div v-if="item.media" class="size-8 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-0">
            <XIcon class="size-[60%]" :media="item.media" />
          </div>
          <span class="">{{ item.title }}</span>
        </div>
        <i class="i-tabler-chevron-right text-lg opacity-80 text-theme-500" />
      </a>
    </div>
  </WidgetWrap>
</template>

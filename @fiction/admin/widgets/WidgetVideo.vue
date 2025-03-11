<script lang="ts" setup>
import type { Widget } from '@fiction/admin/dashboard/widget'
import type { NavItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

const { widget, card } = defineProps<{
  widget: Widget
  card: Card
}>()

const items: NavItem[] = [

  {
    title: 'Start a New Post',
    href: card.link('/posts'),
    media: { format: 'iconClass', class: 'i-tabler-pencil' },
  },
  {
    title: 'Edit Your Site',
    href: card.link('/sites'),
    media: { format: 'iconClass', class: 'i-tabler-layout' },
  },
  {
    title: 'Manage Your Network',
    href: card.link('/audience'),
    media: { format: 'iconClass', class: 'i-tabler-users' },
  },
]
</script>

<template>
  <WidgetWrap :widget>
    <div v-for="(item, i) in items" :key="i">
      <a
        :href="item.href"
        class="flex items-center justify-between px-3 py-2 font-medium text-sm rounded-lg transition-all hover:bg-theme-100/10 dark:hover:bg-theme-700/50"
      >
        <div class="flex items-center gap-4">
          <div v-if="item.media" class="size-8 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/70 text-primary-600 dark:text-primary-0">
            <XIcon class="size-[60%]" :media="item.media" />
          </div>
          <span class="">{{ item.title }}</span>
        </div>
        <i class="i-tabler-chevron-right text-lg opacity-80 text-theme-500" />
      </a>
    </div>
  </WidgetWrap>
</template>

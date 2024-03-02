<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import { getNavComponentType, toLabel, toSlug, vue } from '@fiction/core'
import ElPanel from '@fiction/ui/ElPanel.vue'
import type { Card } from '../../../card'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const routeItemId = vue.computed(() => toSlug(props.card.site?.siteRouter.params.value.itemId as string) || 'general')
const currentPanel = vue.computed(() => props.card.cards.value.find(p => toSlug(p.slug.value) === routeItemId.value))

const nav = vue.computed<NavItem[]>(() => {
  return props.card.cards.value
    .filter(_ => _.userConfig.value.isNavItem)
    .map((v) => {
      const itemId = props.card.site?.siteRouter.params.value.itemId || 'general'
      return {
        name: v.title.value || toLabel(v.slug.value),
        href: v.link(`/settings/${v.slug.value}`),
        isActive: v.slug.value === itemId,
      }
    })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElPanel class="border dark:border-theme-700 mx-5 rounded-md" box-class="p-0">
      <div class="flex">
        <div class="border-theme-300 dark:border-theme-700 w-40 shrink-0 rounded-l-md border-r pb-32 p-4 dark:bg-theme-900">
          <div class="text-theme-300 dark:text-theme-500/50 py-4 font-semibold text-xs uppercase">
            Settings
          </div>
          <div class="space-y-0">
            <component
              :is="getNavComponentType(v)"
              v-for="(v, i) in nav"
              :key="i"
              class="flex items-center space-x-2 px-3 py-2.5 text-sm font-semibold rounded-md transition-all duration-200"
              :to="v.href"
              :href="v.href"
              :class=" v.isActive ? 'bg-theme-100 dark:bg-primary-950 text-theme-900 dark:text-theme-0' : 'text-theme-500 dark:text-theme-0 hover:bg-theme-100 dark:hover:bg-theme-800' "
            >
              <div v-if="v.icon" class="text-[1.4em]">
                <div :class="v.icon" />
              </div>
              <div>{{ v.name }}</div>
            </component>
          </div>
        </div>
        <div class="grow min-w-0">
          <component :is="currentPanel?.tpl.value?.settings.el" :card="currentPanel" />
        </div>
      </div>
    </ElPanel>
  </div>
</template>

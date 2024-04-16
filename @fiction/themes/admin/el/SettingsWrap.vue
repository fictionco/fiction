<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import { getNavComponentType, toLabel, toSlug, vue } from '@fiction/core'
import ElPanel from '@fiction/ui/ElPanel.vue'
import type { Card } from '@fiction/site/card'

export type UserConfig = { isNavItem?: boolean, navIcon?: string, navIconAlt?: string, parentItemId?: string }

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const routeItemId = vue.computed(() => toSlug(props.card.site?.siteRouter.params.value.itemId as string) || 'organization')
const currentPanel = vue.computed(() => props.card.cards.value.find(p => toSlug(p.slug.value) === routeItemId.value))

const nav = vue.computed<NavItem[]>(() => {
  const allCards = props.card.cards.value
  return allCards
    .filter(_ => _.userConfig.value.isNavItem)
    .map((v) => {
      const navUc = v.userConfig.value as UserConfig
      const itemId = props.card.site?.siteRouter.params.value.itemId || 'organization'
      const parentItemId = currentPanel.value?.userConfig.value.parentItemId
      const isActive = !!(v.slug.value === itemId || (parentItemId && v.slug.value === parentItemId))

      const icon = isActive && navUc.navIconAlt ? navUc.navIconAlt : navUc.navIcon ? navUc.navIcon : 'i-heroicons-arrow-small-right-20-solid'
      return { name: v.title.value || toLabel(v.slug.value), href: v.link(`/settings/${v.slug.value}`), isActive, icon }
    })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElPanel class=" mx-5 rounded-md bg-theme-0 dark:bg-theme-800" box-class="p-0">
      <div class="flex">
        <div class="border-theme-200 dark:border-theme-700 w-48 shrink-0 rounded-l-md  pb-32 px-4 py-4  dark:bg-theme-900">
          <div class="space-y-1 text-right">
            <component
              :is="getNavComponentType(v)"
              v-for="(v, i) in nav"
              :key="i"
              class="flex items-center space-x-2 px-4 py-2.5 text-sm  rounded-lg transition-all duration-200"
              :to="v.href"
              :href="v.href"
              :class="
                v.isActive
                  ? 'active font-bold bg-theme-50 dark:bg-theme-700 dark:text-theme-0'
                  : 'inactive font-medium text-theme-600 dark:text-theme-0 hover:bg-theme-100/50 dark:hover:bg-theme-800' "
            >
              <div v-if="v.icon" class="text-[1.4em] shrink-0" :class="v.icon" />
              <div>{{ v.name }}</div>
            </component>
          </div>
        </div>
        <div class="grow min-w-0  border-theme-200 dark:border-theme-700 border rounded-md">
          <component :is="currentPanel?.tpl.value?.settings.el" :card="currentPanel" />
        </div>
      </div>
    </ElPanel>
  </div>
</template>

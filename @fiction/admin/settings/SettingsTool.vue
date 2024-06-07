<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { NavItem } from '@fiction/core'
import { getNavComponentType, toLabel, toSlug, useService, vue } from '@fiction/core'
import ElPanel from '@fiction/ui/ElPanel.vue'
import type { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { SettingsTool } from '..'
import ToolForm from '../tools/ToolForm.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  tools: { type: Array as vue.PropType<SettingsTool[]>, required: true },
  basePath: { type: String, required: true },
})

const service = useService()

export type UserConfig = object

const routeItemId = vue.computed(() => toSlug(props.card.site?.siteRouter.params.value.itemId as string) || props.tools[0].slug)
const currentPanel = vue.computed(() => props.tools.find(p => toSlug(p.slug) === routeItemId.value))
const currentPanelOptions = vue.computed<InputOption[]>(() => currentPanel.value?.options?.({ tool: currentPanel.value, service }).value || [])

const nav = vue.computed<NavItem[]>(() => {
  const tools = props.tools || []
  return tools
    .filter(t => t.userConfig?.isNavItem)
    .map((t) => {
      const tc = t.userConfig || {}
      const itemId = props.card.site?.siteRouter.params.value.itemId || tools[0].slug
      const parentItemId = currentPanel.value?.userConfig?.parentItemId
      const isActive = !!(t.slug === itemId || (parentItemId && t.slug === parentItemId))

      const icon = isActive && tc.navIconAlt ? tc.navIconAlt : tc.navIcon ? tc.navIcon : 'i-heroicons-arrow-small-right-20-solid'
      const link = `${props.basePath}/${t.slug}`
      return { name: t.title || toLabel(t.slug), href: props.card.link(link), isActive, icon }
    })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElPanel class=" mx-5 rounded-md" box-class="p-0">
      <div class="flex border-theme-300/60 dark:border-theme-600/90 border rounded-md overflow-hidden">
        <div class=" w-56 shrink-0 rounded-l-md pb-32 px-4 py-4 dark:bg-theme-700/50 border-r border-theme-600/60">
          <div class="space-y-1 text-right">
            <component
              :is="getNavComponentType(v)"
              v-for="(v, i) in nav"
              :key="i"
              class="flex items-center space-x-3 px-3 py-2.5 text-sm  rounded-lg transition-all duration-200"
              :to="v.href"
              :href="v.href"
              :class="
                v.isActive
                  ? 'active font-bold bg-theme-50 dark:bg-theme-600/30 dark:text-theme-0 ring-1 ring-inset ring-theme-500'
                  : 'inactive font-medium text-theme-600 dark:text-theme-0 hover:bg-theme-100/50 dark:hover:bg-theme-800' "
            >
              <div v-if="v.icon" class="text-[1.4em] shrink-0 opacity-80" :class="v.icon" />
              <div>{{ v.name }}</div>
            </component>
          </div>
        </div>
        <ElForm class="grow min-w-0 bg-theme-0 dark:bg-theme-900 rounded-r-lg">
          <ToolForm ui-size="lg" :options="currentPanelOptions" :card :disable-group-hide="true" />
        </ElForm>
      </div>
    </ElPanel>
  </div>
</template>

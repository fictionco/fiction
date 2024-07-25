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
  title: { type: String, default: '' },
})

const service = useService()

export type UserConfig = object

const panels = vue.computed(() => props.tools.filter(t => t.slug))

const routeItemId = vue.computed(() => toSlug(props.card.site?.siteRouter.params.value.itemId as string) || panels.value[0].slug)

const currentPanel = vue.computed(() => panels.value.find(p => toSlug(p.slug) === routeItemId.value))
const currentPanelOptions = vue.computed<InputOption[]>(() => currentPanel.value?.options?.({ tool: currentPanel.value, service }).value || [])

const nav = vue.computed<NavItem[]>(() => {
  const tools = props.tools || []
  return tools
    .filter(t => t.userConfig?.isNavItem)
    .map((t) => {
      const tc = t.userConfig || {}
      const itemId = props.card.site?.siteRouter.params.value.itemId || panels.value[0].slug
      const parentItemId = currentPanel.value?.userConfig?.parentItemId
      const isActive = !!(t.slug === itemId || (parentItemId && t.slug === parentItemId))

      const icon = isActive && tc.navIconAlt ? tc.navIconAlt : tc.navIcon ? tc.navIcon : 'i-heroicons-arrow-small-right-20-solid'
      const link = t.href || `${props.basePath}/${t.slug}`
      return { name: t.title.value || toLabel(t.slug), href: props.card.link(link), isActive, icon }
    })
})

const actions = vue.computed(() => {
  const tool = currentPanel.value
  return tool?.getActions?.({ tool, service }).value || []
})

async function navigate(v: NavItem) {
  if (v.href) {
    await props.card.goto(v.href, { retainQueryVars: true, replace: true })
  }
}
</script>

<template>
  <div>
    <ElPanel
      class="border-theme-300/80 dark:border-theme-600/90 border rounded-md  "
      box-class="p-0"
      header-class="border-b dark:border-theme-600/60 border-theme-300/60"
      :title
      :actions="actions"
    >
      <div class="flex">
        <div class=" md:w-48 shrink-0 rounded-l-md pb-32 p-3  border-r dark:border-theme-600/60 border-theme-300/60">
          <div class="space-y-1 text-right">
            <component
              :is="getNavComponentType(v)"
              v-for="(v, i) in nav"
              :key="i"
              class="flex items-center space-x-3 px-3 py-2.5 text-sm  rounded-lg transition-all duration-100 "
              :to="v.href"
              :href="v.href"
              :class="
                v.isActive
                  ? 'active font-bold bg-primary-100/50 text-primary-700 hover:text-primary-500 dark:bg-theme-600/50 dark:text-theme-0'
                  : 'inactive font-medium text-theme-600 dark:text-theme-0 hover:bg-theme-100/30 dark:hover:bg-theme-700/60' "
              @click.prevent="navigate(v)"
            >
              <div v-if="v.icon" class="text-[1.4em] shrink-0 opacity-80" :class="v.icon" />
              <div class="min-w-0 truncate overflow-ellipsis">
                {{ v.name }}
              </div>
            </component>
          </div>
        </div>
        <ElForm v-if="currentPanel?.val" class="grow min-w-0 bg-theme-0 dark:bg-theme-900 rounded-r-lg overflow-hidden ">
          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-x-12"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="ease-in duration-300"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-12"
            mode="out-in"
          >
            <div :key="currentPanel.slug">
              <div class="px-6 py-4 mb-6 font-semibold text-lg dark:text-theme-600 text-theme-300">
                {{ currentPanel.title.value }}
              </div>
              <ToolForm
                v-model="currentPanel.val.value"
                :data-settings-tool="currentPanel.slug"
                ui-size="lg"
                :options="currentPanelOptions"
                :card
                :disable-group-hide="true"
                :data-value="JSON.stringify(currentPanel.val.value)"
              />
            </div>
          </transition>
        </ElForm>
      </div>
    </ElPanel>
  </div>
</template>

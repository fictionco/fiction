<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { NavItem, Organization, User } from '@fiction/core'
import { getNavComponentType, toLabel, toSlug, useService, vue } from '@fiction/core'
import ElPanel from '@fiction/ui/ElPanel.vue'
import type { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
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

const value = vue.computed({
  get: () => {
    return {
      org: service.fictionUser.activeOrganization.value,
      user: service.fictionUser.activeUser.value,
    }
  },
  set: (v: { user?: User, org?: Organization }) => {
    if (v.user)
      service.fictionUser.activeUser.value = v.user
    if (v.org)
      service.fictionUser.activeOrganization.value = v.org
  },
})

const sending = vue.ref(false)
async function runSave() {
  sending.value = true

  try {
    const tool = currentPanel.value
    if (!tool)
      throw new Error('No value to save')

    await currentPanel.value?.save?.({ tool, service })
  }
  catch (e) {
    console.error('Error saving user config', e)
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElPanel class="rounded-md" box-class="p-0">
      <div class="flex border-theme-300/80 dark:border-theme-600/90 border rounded-md overflow-hidden">
        <div class="md:w-48 2xl:w-64 shrink-0 rounded-l-md pb-32 px-4 py-4 dark:bg-theme-700/50 border-r dark:border-theme-600/60 border-theme-300/60">
          <div class="space-y-1 text-right">
            <component
              :is="getNavComponentType(v)"
              v-for="(v, i) in nav"
              :key="i"
              class="flex items-center space-x-3 px-3 py-2.5 text-sm  rounded-lg transition-all duration-100"
              :to="v.href"
              :href="v.href"
              :class="
                v.isActive
                  ? 'active font-bold bg-primary-50 text-theme-600 dark:bg-theme-600/30 dark:text-theme-0 ring-1 ring-inset ring-theme-300 dark:ring-theme-500'
                  : 'inactive font-medium text-theme-600 dark:text-theme-0 hover:bg-theme-100/30 dark:hover:bg-theme-800' "
            >
              <div v-if="v.icon" class="text-[1.4em] shrink-0 opacity-80" :class="v.icon" />
              <div>{{ v.name }}</div>
            </component>
          </div>
        </div>
        <ElForm class="grow min-w-0 bg-theme-0 dark:bg-theme-900 rounded-r-lg" @submit="runSave()">
          <div class="header flex items-center justify-between py-3 px-4 border-b border-theme-300/70 dark:border-theme-600/70">
            <div class="font-bold">
              {{ currentPanel?.title }}
            </div>
            <div>
              <ElButton btn="primary" type="submit" icon="i-tabler-upload" :loading="sending">
                Save Changes
              </ElButton>
            </div>
          </div>
          <ToolForm
            v-if="currentPanel?.val"
            v-model="currentPanel.val.value"
            :data-settings-tool="currentPanel.slug"
            ui-size="lg"
            :options="currentPanelOptions"
            :card
            :disable-group-hide="true"
          />
        </ElForm>
      </div>
    </ElPanel>
  </div>
</template>

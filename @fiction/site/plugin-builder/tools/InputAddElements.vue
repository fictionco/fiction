<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { NavListItem } from '@fiction/core'
import type { CardTemplate } from '../../card'
import type { Site } from '../../site'
import type { PageRegion } from '../../tables'
import screenDefaultDark from '@fiction/cards/utils/img/screen-dark.svg'
import screenDefaultLight from '@fiction/cards/utils/img/screen-light.svg'
import { isDarkOrLightMode, toLabel, vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import InputRadioButton from '@fiction/ui/inputs/InputRadioButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const frequencyOrder = ['common', 'standard', 'niche', 'advanced'] as const

const groupTemplates = vue.computed(() => {
  const all = props.site.theme.value?.templates.filter(t => t.settings.isPublic && !t.settings.isEffect) || []
  const grouped: Record<string, CardTemplate[]> = { common: [], standard: [], niche: [] }
  const seenTemplates = new Set<string>()

  all.forEach((template) => {
    const templateId = template.settings.templateId
    if (seenTemplates.has(templateId))
      return
    seenTemplates.add(templateId)

    const frequency = template.settings.frequency || 'niche'
    if (frequencyOrder.includes(frequency)) {
      grouped[frequency].push(template)
    }
    else {
      grouped.niche.push(template)
    }
  })

  return frequencyOrder.reduce((acc, freq) => {
    if (grouped[freq] && grouped[freq].length > 0)
      acc[freq] = grouped[freq]
    return acc
  }, {} as Record<string, CardTemplate[]>)
})

const searchQuery = vue.ref('')
const filteredTemplates = vue.computed(() => {
  const templateGroups = { ...groupTemplates.value }
  if (!searchQuery.value)
    return templateGroups

  const query = searchQuery.value.toLowerCase()
  const filteredGroups: Record<string, CardTemplate[]> = {}

  Object.entries(templateGroups).forEach(([frequency, templates]) => {
    const filtered = templates.filter((template) => {
      const title = template.settings.title?.toLowerCase() || ''
      const description = template.settings.description?.toLowerCase() || ''
      const templateId = template.settings.templateId?.toLowerCase()
      const tags = template.settings.tags?.map(t => t.toLowerCase()) || []

      return title.includes(query)
        || description.includes(query)
        || templateId?.includes(query)
        || tags.some(t => t.includes(query))
    })

    if (filtered.length > 0) {
      filteredGroups[frequency] = filtered
    }
  })

  return filteredGroups
})

const regionOptions = vue.computed<NavListItem[]>(() => [
  { label: 'Top', value: 'main_top' },
  { label: 'Bottom', value: 'main' },
])

const selectedRegion = vue.ref<PageRegion>('main_top')

vue.watch(selectedRegion, (newRegion) => {
  if (props.site.editor.value) {
    props.site.editor.value.selectedRegionId = newRegion
  }
})

async function addCard(args: { templateId?: string }) {
  const { templateId = 'page' } = args
  const r = selectedRegion.value.split('_')
  const addToRegion = r[0] || 'main'
  const location = (r[1] || 'bottom') as 'top' | 'bottom'

  await props.site.addCard({
    templateId,
    delay: 400,
    location,
    addToRegion,
  })

  await props.site.editorActivateTool({ toolId: '' })
}

const addElementsVisible = vue.ref(true)

const colorMode = vue.computed(() => isDarkOrLightMode())
function getScreenshotUrl(template: CardTemplate) {
  return colorMode.value === 'light'
    ? template.settings.screenshot?.light || screenDefaultLight
    : template.settings.screenshot?.dark || screenDefaultDark
}

vue.watch(addElementsVisible, (visible) => {
  if (!visible)
    searchQuery.value = ''
})
</script>

<template>
  <div>
    <TransitionSlide>
      <div v-if="addElementsVisible">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="flex-1">
            <div class="text-[10px] text-theme-500 mb-1 font-medium font-sans">
              Filter Sections
            </div>
            <div class="relative">
              <InputText
                v-model="searchQuery"
                placeholder="Search sections..."
                ui-size="sm"
              />
              <button
                v-if="searchQuery"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-theme-400 dark:text-theme-500 hover:text-theme-600 dark:hover:text-theme-300"
                @click="searchQuery = ''"
              >
                <span class="i-tabler-x text-sm" />
              </button>
            </div>
          </div>
          <div>
            <div class="text-[10px] text-theme-500 mb-1 font-medium font-sans">
              Add To...
            </div>
            <InputRadioButton
              v-model="selectedRegion"
              :list="regionOptions"
              placeholder="Region"
              ui-size="sm"
              class="w-40"
            />
          </div>
        </div>

        <div class="space-y-2 select-none">
          <div
            v-for="(tplGroup, freq) in filteredTemplates"
            :key="freq"
            class="mb-6"
          >
            <div class="text-[10px] font-semibold text-theme-300 dark:text-theme-500 mb-2 tracking-wider uppercase">
              {{ toLabel(freq) }}
            </div>
            <div class="grid grid-cols-3 gap-6">
              <div
                v-for="(item, i) in tplGroup"
                :key="i"
                :data-test-id="`add-element-${item.settings.templateId}`"
                :theme="item.settings.colorTheme || 'theme'"
                class="text-xs cursor-pointer hover:opacity-80 flex flex-col items-center justify-center group"
                :icon="item.settings.icon"
                @click.prevent="addCard({ templateId: item.settings.templateId })"
              >
                <XMedia
                  :media="{ url: getScreenshotUrl(item) }"
                  class="w-full aspect-[5/3] rounded-md border border-theme-300/70 dark:border-theme-600 overflow-hidden shadow-md group-hover:ring-1 group-hover:ring-theme-400 dark:group-hover:ring-theme-400 transition-all"
                />
                <div
                  class="p-1 text-[9px] tracking-tight line-clamp-2 truncate w-full text-center text-theme-400 dark:text-theme-200 font-mono font-normal"
                >
                  {{ item.settings.title }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="Object.keys(filteredTemplates).length === 0" class="py-8 text-center text-theme-400 dark:text-theme-500 text-sm">
            No elements match your search
          </div>
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>

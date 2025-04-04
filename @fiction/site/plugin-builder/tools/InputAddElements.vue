<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { ListItem, NavListItem } from '@fiction/core'
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
import { OldCardCategorySchema } from '../../card'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const groupTemplates = vue.computed(() => {
  const all = props.site.theme.value?.templates.filter(t => t.settings.isPublic && !t.settings.isEffect)
  const grouped: Record<string, CardTemplate[]> = {}

  // Group templates by category
  all?.forEach((template) => {
    template.settings.category?.forEach((cat) => {
      if (!grouped[cat])
        grouped[cat] = []
      grouped[cat].push(template)
    })
  })

  const categoryOrder = OldCardCategorySchema.options

  // Order grouped categories based on categoryOrder and include any additional categories at the end
  return categoryOrder.reduce((acc, cat) => {
    if (grouped[cat])
      acc[cat] = grouped[cat]
    return acc
  }, Object.keys(grouped).reduce((acc, cat) => {
    if (!categoryOrder.includes(cat as typeof categoryOrder[number]))
      acc[cat] = grouped[cat]
    return acc
  }, {} as Record<string, CardTemplate[]>))
})

// Search and filter
const searchQuery = vue.ref('')
const filteredTemplates = vue.computed(() => {
  const templateGroups = { ...groupTemplates.value }
  if (!searchQuery.value)
    return templateGroups

  const query = searchQuery.value.toLowerCase()
  const filteredGroups: Record<string, CardTemplate[]> = {}

  // Filter each group
  Object.entries(templateGroups).forEach(([category, templates]) => {
    const filtered = templates.filter((template) => {
      const title = template.settings.title?.toLowerCase() || ''
      const description = template.settings.description?.toLowerCase() || ''
      const templateId = template.settings.templateId?.toLowerCase()
      const categories = template.settings.category?.map(c => c.toLowerCase()) || []

      return title.includes(query)
        || description.includes(query)
        || templateId?.includes(query)
        || categories.some(c => c.includes(query))
    })

    if (filtered.length > 0) {
      filteredGroups[category] = filtered
    }
  })

  return filteredGroups
})

// Region selection
const regionOptions = vue.computed<NavListItem[]>(() => {
  const options: NavListItem[] = [
    { label: 'Top', value: 'main_top' },
    { label: 'Bottom', value: 'main' },
  ]

  // Add sections
  // const sections = props.site.sections.value || {}
  // Object.entries(sections).forEach(([key, value]) => {
  //   options.push({
  //     label: `${toLabel(key)}`,
  //     value: key,
  //   })
  // })

  return options
})

const selectedRegion = vue.ref<PageRegion>('main_top')

// Watch for changes in selected region
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

  await props.site.editorActivateTool({ toolId: 'sectionsLayout' })
}

const addElementsVisible = vue.ref(true)

const colorMode = vue.computed(() => isDarkOrLightMode())
function getScreenshotUrl(template: CardTemplate) {
  return colorMode.value === 'light'
    ? template.settings.screenshot?.light || screenDefaultLight
    : template.settings.screenshot?.dark || screenDefaultDark
}

// Reset search when closing
vue.watch(addElementsVisible, (visible) => {
  if (!visible) {
    searchQuery.value = ''
  }
})
</script>

<template>
  <div>
    <TransitionSlide>
      <div v-if="addElementsVisible">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class=" flex-1">
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
            v-for="(tplGroup, i) in filteredTemplates"
            :key="i"
            class="mb-6"
          >
            <div class="text-[10px] font-semibold text-theme-300 dark:text-theme-500 mb-2 tracking-wider uppercase">
              {{ toLabel(i) }}
            </div>
            <div class="space-y-2">
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="(item, ii) in tplGroup"
                  :key="ii"
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
                    class="p-1 text-[10px] tracking-tight line-clamp-2 truncate w-full text-center text-theme-400 dark:text-theme-200 font-mono font-medium"
                  >
                    {{ item.settings.title }}
                  </div>
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

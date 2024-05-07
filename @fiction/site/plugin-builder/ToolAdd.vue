<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import type { CardTemplate } from '../card'
import type { Site } from '../site'
import { categoryOrder } from '../card'
import { siteEditController } from './tools'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})

const groupTemplates = vue.computed(() => {
  const all = props.site.theme.value?.templates.filter(t => t.settings.isPublic)
  const grouped: Record<string, CardTemplate[]> = {}

  // Group templates by category
  all?.forEach((template) => {
    template.settings.category?.forEach((cat) => {
      if (!grouped[cat])
        grouped[cat] = []
      grouped[cat].push(template)
    })
  })

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

function addCard(args: { templateId: string }) {
  const { templateId = 'page' } = args
  props.site.addCard({ templateId, delay: 400 })
  siteEditController.useTool({ toolId: 'layout' })
}
</script>

<template>
  <ElTool :tool="tool">
    <div class="p-4 pb-24">
      <ElInput
        label="Add To Region"
        input="InputSelectCustom"
        :list="Object.keys(site.layout.value)"
        class="mb-8"
        :model-value="site.activeRegionKey.value"
        @update:model-value="site.activeRegionKey.value = $event"
      />
      <div class="space-y-4 select-none">
        <div v-for="(tplGroup, i) in groupTemplates" :key="i">
          <div class="text-[10px] font-semibold text-theme-300 dark:text-theme-0 mb-2 tracking-wider uppercase">
            {{ toLabel(i) }}
          </div>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(item, ii) in tplGroup"
                :key="ii"
                class="flex flex-col shadow-sm group cursor-pointer hover:shadow hover:-translate-y-0.5 transition-all rounded-md w-[30%] border border-theme-300/80 dark:border-theme-600 p-1 space-y-1 text-theme-600 dark:text-theme-50 hover:bg-theme-50 dark:hover:bg-theme-800"
                @click="addCard({ templateId: item.settings.templateId })"
              >
                <div
                  class="px-3 text-3xl flex justify-center items-center text-theme-500"
                >
                  <div :class="item.settings.icon" />
                </div>
                <div class="px-1 grow">
                  <div class=" leading-tight truncate text-center">
                    <div class="font-medium text-[10px] text-theme-500  dark:text-theme-200 truncate tracking-tight">
                      {{ item.settings.title }}
                    </div>
                    <div class="hidden text-[10px] font-normal text-theme-400 dark:text-theme-100">
                      {{ item.settings.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElTool>
</template>

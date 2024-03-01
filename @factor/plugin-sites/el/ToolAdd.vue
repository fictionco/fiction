<script lang="ts" setup>
import { toLabel, vue } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import type { CardTemplate } from '../card'
import type { Site } from '../site'
import { iconStyle } from '../util'
import type { EditorTool } from './tools'
import ElTool from './ElTool.vue'

const props = defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    required: true,
  },
  tool: {
    type: Object as vue.PropType<EditorTool>,
    required: true,
  },
})
const control = props.site.settings.factorSites
const groupTemplates = vue.computed(() => {
  const all = props.site.theme.value?.templates

  const grouped: Record<string, CardTemplate[]> = {}

  if (all) {
    all.forEach((template) => {
      template.settings.category?.forEach((cat) => {
        if (!grouped[cat])
          grouped[cat] = []

        grouped[cat].push(template)
      })
    })
  }
  return grouped
})

function addCard(args: { templateId: string }) {
  const { templateId = 'page' } = args
  props.site.addCard({ templateId, delay: 400 })
  control.useTool({ toolId: 'layout' })
}

function ic(item: CardTemplate) {
  const cls = iconStyle[item.settings.iconTheme || 'theme']

  return `${cls.color} ${cls.bg} ${cls.border}`
}
</script>

<template>
  <ElTool :tool="tool">
    <div class="p-4 pb-24">
      <ElInput
        label="Add Element To"
        input="InputSelectCustom"
        :list="Object.keys(site.layout.value)"
        class="mb-8"
        :model-value="site.activeRegionKey.value"
        @update:model-value="site.activeRegionKey.value = $event"
      />
      <div class="space-y-4">
        <div v-for="(tplGroup, i) in groupTemplates" :key="i">
          <div class="text-[10px] font-semibold text-theme-300 dark:text-theme-0 mb-2 tracking-wider uppercase">
            {{ toLabel(i) }}
          </div>
          <div class="space-y-2">
            <div
              v-for="(item, ii) in tplGroup"
              :key="ii"
              class="flex shadow-sm group cursor-pointer hover:shadow hover:-translate-y-0.5 transition-all rounded-md"
              @click="addCard({ templateId: item.settings.templateId })"
            >
              <div
                class="px-3 py-1 text-3xl flex justify-center items-center border rounded-l-md  "
                :class="ic(item)"
              >
                <div :class="item.settings.icon" />
              </div>
              <div class="px-3 py-2 flex items-center grow rounded-r-md border-y border-r border-theme-300 dark:border-theme-600 group-hover:bg-theme-100 dark:group-hover:bg-theme-700 bg-theme-50 dark:bg-theme-800">
                <div class=" leading-tight">
                  <div class="font-semibold text-xs text-theme-700 dark:text-theme-0">
                    {{ item.settings.title }}
                  </div>
                  <div class="text-[10px] font-normal text-theme-400 dark:text-theme-100">
                    {{ item.settings.description }}
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

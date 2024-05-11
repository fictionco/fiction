<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import type { EditorTool } from '@fiction/admin'
import ElBadge from '@fiction/ui/common/ElBadge.vue'
import type { CardTemplate } from '../../card'
import type { Site } from '../../site'
import { categoryOrder } from '../../card'

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
}
</script>

<template>
  <div>
    <div>
      <div class="space-y-4 select-none">
        <div v-for="(tplGroup, i) in groupTemplates" :key="i">
          <div class="text-[10px] font-semibold text-theme-300 dark:text-theme-0 mb-2 tracking-wider uppercase">
            {{ toLabel(i) }}
          </div>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <ElBadge
                v-for="(item, ii) in tplGroup"
                :key="ii"
                :theme="item.settings.colorTheme || 'theme'"
                href="#"
                :icon="item.settings.icon"
                @click.prevent="addCard({ templateId: item.settings.templateId })"
              >
                {{ item.settings.title }}
              </ElBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

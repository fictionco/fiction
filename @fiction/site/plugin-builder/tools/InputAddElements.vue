<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import type { EditorTool } from '@fiction/admin'
import ElBadge from '@fiction/ui/common/ElBadge.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import type { CardTemplate } from '../../card'
import type { Site } from '../../site'
import { CardCategorySchema } from '../../card'

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

  const categoryOrder = CardCategorySchema.options

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

async function addCard(args: { templateId: string }) {
  const { templateId = 'page' } = args
  await props.site.addCard({ templateId, delay: 400 })
}

const addElementsVisible = vue.ref(false)

function toggleAddElements() {
  addElementsVisible.value = !addElementsVisible.value
}
</script>

<template>
  <div>
    <div>
      <XButton
        :theme="addElementsVisible ? 'theme' : 'primary'"
        rounding="full"
        design="solid"
        size="sm"
        icon="i-tabler-plus"
        @click.prevent="toggleAddElements()"
      >
        {{ addElementsVisible ? 'Close' : 'Add New Elements' }}
      </XButton>
    </div>
    <TransitionSlide>
      <div v-if="addElementsVisible">
        <div class="space-y-4 select-none py-6">
          <div v-for="(tplGroup, i) in groupTemplates" :key="i">
            <div class="text-[10px] font-semibold text-theme-300 dark:text-theme-0 mb-2 tracking-wider uppercase">
              {{ toLabel(i) }}
            </div>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <XButton
                  v-for="(item, ii) in tplGroup"
                  :key="ii"
                  :theme="item.settings.colorTheme || 'theme'"
                  class="cursor-pointer hover:opacity-80"
                  rounding="full"
                  design="ghost"
                  size="xs"
                  href="#"
                  :icon="item.settings.icon"
                  @click.prevent="addCard({ templateId: item.settings.templateId })"
                >
                  {{ item.settings.title }}
                </XButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>

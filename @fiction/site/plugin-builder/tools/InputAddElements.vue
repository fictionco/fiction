<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { CardTemplate } from '../../card'
import type { Site } from '../../site'
import screenDefaultDark from '@fiction/cards/utils/img/screen-dark.svg'
import screenDefaultLight from '@fiction/cards/utils/img/screen-light.svg'
import { isDarkOrLightMode, toLabel, vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { OldCardCategorySchema } from '../../card'

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

async function addCard(args: { templateId?: string }) {
  const { templateId = 'page' } = args

  await props.site.addCard({ templateId, delay: 400 })
}

const addElementsVisible = vue.ref(true)

function toggleAddElements() {
  addElementsVisible.value = !addElementsVisible.value
}

const colorMode = vue.computed(() => isDarkOrLightMode())
function getScreenshotUrl(template: CardTemplate) {
  return colorMode.value === 'light'
    ? template.settings.screenshot?.light || screenDefaultLight
    : template.settings.screenshot?.dark || screenDefaultDark
}
</script>

<template>
  <div>
    <div v-if="false">
      <XButton
        data-test-id="add-new-elements"
        :theme="addElementsVisible ? 'theme' : 'primary'"
        rounding="full"
        design="solid"
        size="md"
        :icon="addElementsVisible ? 'i-tabler-x' : 'i-tabler-plus'"
        format="block"
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
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="(item, ii) in tplGroup"
                  :key="ii"
                  :data-test-id="`add-element-${item.settings.templateId}`"
                  :theme="item.settings.colorTheme || 'theme'"
                  class="text-xs cursor-pointer hover:opacity-80 flex flex-col items-center justify-center "

                  :icon="item.settings.icon"
                  @click.prevent="addCard({ templateId: item.settings.templateId })"
                >
                  <XMedia
                    :media="{ url: getScreenshotUrl(item) }"
                    class="w-full aspect-[5/3] rounded-md border border-theme-300/70 dark:border-theme-600 overflow-hidden shadow-md"
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
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>

<script setup lang="ts">
import { vue } from '@fiction/core'
import { BubbleMenu, isTextSelection } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import ButtonMenu from './ButtonMenu.vue'
import { BubbleMenuTools } from './menu'
import type { MenuType } from './menu'

const props = defineProps({
  editor: { type: Object as vue.PropType<Editor>, required: true },
  menuType: { type: String as vue.PropType<MenuType>, default: undefined },

})

const menuTools = new BubbleMenuTools({ editor: props.editor })

const items = vue.computed(() => menuTools.activeMenu.value)
type ShouldShowArgs = Parameters<NonNullable<InstanceType<typeof BubbleMenu>['$props']['shouldShow']>>[0]
function shouldShow(args: ShouldShowArgs) {
  const { editor, view, state, from, to } = args
  // Reworked from the default, because we only want the selection
  // menu for text selections where a mark change will be visible.
  // https://github.com/ueberdosis/tiptap/blob/063ced27ca55f331960b01ee6aea5623eee0ba49/packages/extension-bubble-menu/src/bubble-menu-plugin.ts#L43
  if (!view.hasFocus())
    return false
  const { doc, selection } = state
  const isText = isTextSelection(selection)
  if (!isText)
    return false
  const isEmpty = selection.empty || (isText && doc.textBetween(from, to).length === 0)
  if (isEmpty)
    return false
  if (editor.isActive('codeBlock'))
    return false
  return true
}
</script>

<template>
  <BubbleMenu
    :should-show="shouldShow"
    :editor
    :tippy-options="{ duration: 100 }"
    class="isolate inline-flex rounded-md shadow-sm"
    @click.stop
  >
    <ButtonMenu :items :editor />
  </BubbleMenu>
</template>

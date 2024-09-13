<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { DraggableList, normalizeList, vue } from '@fiction/core'
import InputElTab from './InputElTab.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  list: {
    type: Array as vue.PropType<(ListItem | 'divider' | string)[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void
}>()

const rankingEl = vue.ref<HTMLElement>()

const attrs = vue.useAttrs()

const validEl = vue.ref<HTMLInputElement>()

const parsedList = vue.computed<ListItem[]>(() => {
  const li = props.list ? normalizeList(props.list) : []

  return li.sort((a, b) => {
    const ap = a.value
    const bp = b.value
    const rankA = props.modelValue.indexOf(ap)
    const rankB = props.modelValue.indexOf(bp)

    let result = 0

    if (rankA < rankB)
      result = -1
    else if (rankA > rankB)
      result = 1

    return result
  })
})

vue.onMounted(async () => {
  const wrap = rankingEl.value
  const update = () => {
    const rank: string[] = []
    wrap?.querySelectorAll('[data-value]').forEach((el) => {
      const element = el as HTMLElement
      const value = element.dataset.value
      if (value)
        rank.push(value)
    })

    emit('update:modelValue', rank)
  }
  new DraggableList({
    wrapClass: 'ranking',
    draggableClass: 'ranking-item',
    ghostClasses: ['ring-4', 'ring-theme-100', 'ring-offset-2'],
    onUpdate: () => update(),
  }).init()

  vue.watch(
    () => props.modelValue,
    (val) => {
      const min = attrs.required === undefined ? 0 : 1

      if ((min && !val) || val.length < min)
        validEl.value?.setCustomValidity(`Please rank these options`)
      else
        validEl.value?.setCustomValidity('')
    },
    { immediate: true },
  )
})
</script>

<template>
  <div ref="rankingEl" class="ranking space-y-2">
    <div v-if="parsedList.length === 0" class="py-6">
      <InputElTab class="ranking-item" label="No Options" />
    </div>
    <template v-else>
      <InputElTab
        v-for="(item, i) in parsedList"
        :key="item.value"
        class="ranking-item cursor-move"
        :prefix="i + 1"
        :label="item.name"
        draggable="true"
        :data-value="item.value"
        icon="i-carbon-draggable"
      />
      <!-- For validation -->
      <input
        ref="validEl"
        class="max-w-input pointer-events-none float-left h-0 w-full p-0 opacity-0"
        type="text"
        :value="modelValue"
      >
    </template>
  </div>
</template>

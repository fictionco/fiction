<template>
  <div ref="rankingEl" class="ranking space-y-2">
    <div
      v-for="(item, i) in parsedList"
      :key="item.value"
      class="ranking-item bg-theme-100 hover:bg-theme-200 border-theme-300 hover:border-theme-400 text-theme-700 max-w-input flex cursor-move items-center justify-between rounded-md border px-2 py-1"
      draggable="true"
      :data-value="item.value"
    >
      <div class="flex items-center space-x-3">
        <div
          class="border-theme-300 text-theme-400 inline-flex w-6 items-center justify-end border-r pr-3 text-right text-xs font-bold"
        >
          {{ i + 1 }}
        </div>
        <div class="text-theme-700">{{ item.name }}</div>
      </div>
      <div class="i-carbon-draggable text-theme-400"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ListItem, normalizeList, vue, DraggableList } from "@factor/api"
//import { textInputClasses } from "@factor/ui/theme"

const rankingEl = vue.ref<HTMLElement>()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  list: {
    type: Array as vue.PropType<(ListItem | "divider")[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string[]): void
}>()

const parsedList = vue.computed<ListItem[]>(() => {
  const li = props.list ? normalizeList(props.list) : []

  return li.sort((a, b) => {
    const ap = a.value
    const bp = b.value
    const rankA = props.modelValue.indexOf(ap)
    const rankB = props.modelValue.indexOf(bp)

    let result = 0

    if (rankA < rankB) {
      result = -1
    } else if (rankA > rankB) {
      result = 1
    }

    return result
  })
})

vue.onMounted(async () => {
  const wrap = rankingEl.value
  const update = () => {
    const rank: string[] = []
    wrap?.querySelectorAll("[data-value]").forEach((el) => {
      const element = el as HTMLElement
      const value = element.dataset.value
      if (value) {
        rank.push(value)
      }
    })

    emit("update:modelValue", rank)
  }
  new DraggableList({
    wrapClass: "ranking",
    draggableClass: "ranking-item",
    ghostClasses: ["ring-4", "ring-theme-100", "ring-offset-2"],
    onUpdate: () => update(),
  })
})
</script>

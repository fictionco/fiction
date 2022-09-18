<template>
  <div class="text-input-size relative inline-block text-left">
    <div>
      <div
        class="border-theme-300 bg-theme-50 text-theme-700 inline-flex w-full cursor-pointer select-none items-center justify-between rounded-full border px-[1em] py-[.4em] text-left font-semibold shadow-sm"
        :class="menuVis ? 'opacity-70' : 'hover:bg-theme-50'"
        @click.stop="menuVis = !menuVis"
      >
        <div class="truncate whitespace-nowrap">
          {{ selected?.name || defaultText || "Select" }}
        </div>

        <svg
          class="ml-[.25em] mr-[-.35em] h-[1em] w-[1em] transition-all"
          :class="menuVis ? `rotate-180 text-theme-800` : `text-theme-500`"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <div
      v-if="menuVis"
      class="bg-theme-0 ring-theme-300 absolute left-0 z-30 mt-2 w-[13em] origin-top-right rounded-md shadow-md ring-1 focus:outline-none"
      :class="direction == 'up' ? 'mb-2 bottom-full' : 'mt-2'"
    >
      <div class="py-1" role="none">
        <template v-for="(item, i) in normalizedList" :key="i">
          <div v-if="item.value == 'divider'" class="">
            <div class="border-theme-200 w-full border-t" />
          </div>
          <div v-else-if="item.value == 'title'" class="">
            <div
              class="text-theme-400 my-2 mb-1 px-4 text-xs font-bold uppercase"
            >
              {{ item.name }}
            </div>
          </div>
          <div
            v-else
            class="text-theme-700 hover:bg-theme-50 text-input-size block cursor-pointer px-[.8em] py-[.35em] hover:font-semibold"
            :class="item.selected ? 'bg-theme-50' : ''"
            @click="update(item.value)"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @unocss-include
import { MenuGroup, ListItem, vue, onResetUi, normalizeList } from "@factor/api"
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))
const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  list: {
    type: Array as vue.PropType<
      (ListItem | string)[] | readonly (ListItem | string)[]
    >,
    default: () => [],
  },
  menu: { type: Object as vue.PropType<MenuGroup[]>, default: undefined },
  defaultText: { type: String, default: "Select" },
  direction: { type: String as vue.PropType<"up" | "down">, default: "down" },
})

const menuList = vue.computed(() => {
  const list = props.menu?.flatMap((group) => {
    if (group.menu) {
      const listItems = group.menu.map((item) => {
        return { name: item.name, value: item.route?.value || item.url }
      })
      return [
        { value: "title", name: group.groupName },
        ...listItems,
      ] as ListItem[]
    } else {
      return []
    }
  })

  return list || []
})

const normalizedList = vue.computed(() => {
  return normalizeList([...props.list, ...menuList.value])
})

const selected = vue.computed(() => {
  return normalizedList.value.find((item) => item.value == props.modelValue)
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string | undefined): void
}>()

const update = async (value?: string) => {
  emit("update:modelValue", value)
  menuVis.value = false
}
</script>

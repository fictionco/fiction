<script lang="ts" setup>
import type {
  ListItem,
  MenuGroup,
} from '@factor/api'
import {
  normalizeList,
  onResetUi,
  resetUi,
  vue,
} from '@factor/api'
import ElButton from './ElButton.vue'
import DropDownList from './DropDownList.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  menu: { type: Object as vue.PropType<MenuGroup[]>, default: undefined },
  defaultText: { type: String, default: 'Select' },
  direction: { type: String, default: 'right' },
  vertical: { type: String as vue.PropType<'up' | 'down'>, default: 'down' },
  size: {
    type: String as vue.PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: '',
  },
  maxWidth: { type: String, default: '150px' },
  format: {
    type: String as vue.PropType<'inline' | 'block'>,
    default: 'inline',
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string | number | undefined): void
}>()
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))
const menuList = vue.computed(() => {
  const list = props.menu?.flatMap((group) => {
    if (group.menu) {
      const listItems = group.menu.map((item) => {
        return { name: item.name, value: item.route?.value || item.url }
      })
      return [
        { value: 'title', name: group.groupName },
        ...listItems,
      ] as ListItem[]
    }
    else {
      return []
    }
  })

  return list || []
})

function toggle() {
  resetUi({ scope: 'inputs', cause: 'dropDownToggle' })
  menuVis.value = !menuVis.value
}

const normalizedList = vue.computed(() => {
  return normalizeList([...props.list, ...menuList.value])
})

const selected = vue.computed(() => {
  const sel = normalizedList.value.find(
    item => item.value === props.modelValue,
  )

  if (sel)
    sel.selected = true

  return sel
})

async function update(value?: string | number) {
  emit('update:modelValue', value)
  resetUi({ scope: 'inputs', cause: 'dropDownUpdate' })
}
</script>

<template>
  <div class="relative" :class="format === 'block' ? 'block' : 'inline-block'">
    <ElButton
      :size="size"
      format="spread"
      @click.stop.prevent="toggle()"
    >
      <div class="flex w-full min-w-0 items-center justify-between space-x-2">
        <div class="grow truncate text-left" :style="{ 'max-width': maxWidth }">
          {{ selected?.name || defaultText || "Select" }}
        </div>
        <div class="flex shrink-0 items-center space-x-1">
          <slot
            v-if="$slots.sel"
            name="sel"
            :item="selected"
          />
          <slot
            v-else-if="$slots.avatar"
            name="avatar"
            :item="selected"
          />
          <div class="i-carbon-chevron-down transition-all" />
        </div>
      </div>
    </ElButton>

    <div
      v-if="menuVis"
      class="bg-theme-0 ring-theme-300 absolute z-30 w-56 origin-top-right overflow-hidden rounded-md shadow-lg ring-1 focus:outline-none"
      :class="[
        direction === 'left' ? 'right-0' : 'left-0',
        vertical === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
      ]"
    >
      <DropDownList
        :list="normalizedList"
        @select="update($event.value)"
      />
    </div>
  </div>
</template>

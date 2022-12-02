<template>
  <div class="max-w-input" @click.stop @keyup.stop @keydown.stop>
    <div
      class="text-theme-700 relative"
      @keydown.down.prevent="
        hovered = hovered == li.length - 1 ? 0 : hovered + 1
      "
      @keydown.up.prevent="hovered = hovered ? hovered - 1 : 0"
      @keydown.enter.prevent="!active ? toggle() : selectByIndex(hovered)"
    >
      <div
        :class="[
          buttonClasses,
          disabled ? 'opacity-80' : 'hover:border-input-edge',
          classButton,
          disabled
            ? 'cursor-not-allowed'
            : 'focus:ring-1 focus:ring-input-primary focus:border-input-primary',
        ]"
        class="space-between flex items-center space-x-3"
        @click="toggle()"
      >
        <div class="w-full grow items-baseline truncate">
          <div class="truncate font-medium">
            {{ selectedItem?.name || defaultValue || defaultText || "Select" }}
          </div>
          <div
            class="select-description text-input-text-alt truncate text-xs opacity-70"
          >
            {{ selectedItem?.desc }}
          </div>
        </div>
        <slot v-if="$slots.avatar" name="avatar" :item="selectedItem"></slot>
        <span
          v-else
          class="text-theme-300 group-hover:text-theme-400 pointer-events-none flex items-center"
          :class="active ? 'text-theme-500' : ''"
        >
          <svg
            class="-mr-2 h-[1.2em] w-[1.2em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <!-- For validation -->
        <input
          class="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 p-0 opacity-0"
          v-bind="$attrs"
          type="text"
          :value="modelValue"
        />
      </div>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="active"
          class="bg-theme-0 ring-theme-200 absolute z-50 mt-1 w-full rounded-md shadow-xl ring-1"
        >
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            :aria-activedescendant="`listbox-item-${selectedIndex}`"
            class="text-input-size max-h-60 overflow-auto rounded-md shadow focus:outline-none"
          >
            <div v-if="!li || li.length == 0" class="p-4">{{ zeroText }}</div>
            <template v-for="(item, i) of li" v-else :key="i">
              <li v-if="item.format == 'divider'" class="">
                <div class="border-input-edge w-full border-t" />
              </li>
              <li
                v-else-if="item.format == 'title'"
                class="py-input-y px-input-x mt-[.5em]"
              >
                <div class="text-theme-300 text-[.8em] font-semibold uppercase">
                  {{ item.name }}
                </div>
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                role="option"
                :class="listItemClass(item, i)"
                class="py-input-y px-input-x group relative cursor-pointer select-none"
                @click="selectValue(item)"
              >
                <div
                  class="flex items-center justify-between space-x-3"
                  :class="classOption"
                >
                  <div class="min-w-0 grow">
                    <div
                      class="shrink-0 truncate font-semibold"
                      :class="item.desc ? '' : 'w-full'"
                    >
                      {{ item.name }}
                    </div>
                    <div
                      v-if="item.desc"
                      class="truncate text-[.9em] opacity-80"
                    >
                      {{ item.desc }}
                    </div>
                  </div>
                  <slot v-if="$slots.avatar" name="avatar" :item="item"></slot>
                  <span
                    v-else-if="isSelected(item.value)"
                    class="flex items-center pr-2 opacity-50"
                    :class="
                      hovered !== i
                        ? 'text-input-primary group-hover:text-white'
                        : ''
                    "
                  >
                    <div class="i-carbon-checkmark text-lg"></div>
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ListItem,
  normalizeList,
  onResetUi,
  vue,
  vueRouter,
  resetUi,
} from "@factor/api"
type RouteListItem = ListItem & { route?: vueRouter.RouteLocationRaw }

const props = defineProps({
  modelValue: { type: [Number, String, Boolean], default: "" },
  list: {
    type: Array as vue.PropType<
      (RouteListItem | string)[] | readonly (RouteListItem | string)[]
    >,
    default: () => [],
  },
  defaultValue: { type: [Number, String, Boolean], default: "" },
  defaultText: { type: String, default: "" },
  zeroText: { type: String, default: "No items." },
  listSuffix: { type: String, default: "" },
  classButton: { type: String, default: "" },
  classOption: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(["update:modelValue"])
const router = vueRouter.useRouter()
const active = vue.ref(false)
const hovered = vue.ref(-1)

if (!props.modelValue && props.defaultValue) {
  emit("update:modelValue", props.defaultValue)
} else if (!props.modelValue) {
  // handle isDefault value in list
  const defaultValue = props.list.find(
    (i) => typeof i == "object" && i.isDefault,
  ) as RouteListItem | undefined
  if (defaultValue) emit("update:modelValue", defaultValue.value)
}

const li = vue.computed(() => normalizeList(props.list ?? []))

const selectedItem = vue.computed<ListItem | undefined>(() => {
  let f = li.value.find((l) => l.value == props.modelValue)
  // If can't find value and default prop is set, use that
  if (!f && props.defaultValue) {
    f = li.value.find((l) => l.value == props.defaultValue)
  }
  return f
})

const selectedIndex = vue.computed<number>(() => {
  return li.value.findIndex((_) => _.value == props.modelValue)
})

const reset = (): void => {
  hovered.value = -1
}

/**
 * Handle click of a drop down value
 */
const selectValue = async (item: RouteListItem): Promise<void> => {
  active.value = false

  if (item?.route) {
    await router.push(item.route)
  } else {
    emit("update:modelValue", item.value)
  }

  reset()
}
/**
 * Select by index in list
 */
const selectByIndex = async (index: number): Promise<void> => {
  const item = li.value[index]
  if (item) {
    await selectValue(item)
  }
}
/**
 * Close on all global resets
 */
onResetUi(() => (active.value = false))
/**
 * Toggle dropdown visibility
 */
const toggle = (): void => {
  if (props.disabled) return

  if (active.value) {
    reset()
  } else {
    resetUi({ scope: "inputs", cause: "startDropdown" })
    hovered.value = selectedIndex.value
    active.value = true
  }
}

const isSelected = (value?: string): boolean => {
  return value && props.modelValue == value ? true : false
}

const listItemClass = (item: ListItem, i: number): string => {
  let out: string[] = []

  if (item.disabled) {
    out.push("opacity-60 cursor-not-allowed")
  } else {
    if (
      (isSelected(item.value) && hovered.value === -1) ||
      hovered.value === i
    ) {
      out.push("bg-theme-100 text-theme-900")
    } else if (isSelected(item.value)) {
      out.push("bg-theme-50")
    } else {
      out.push("font-normal")
    }
    out.push(
      "cursor-pointer focus:text-theme-900 focus:bg-theme hover:text-theme-900 hover:bg-theme-200",
    )
  }

  return out.join(" ")
}

const buttonClasses = [
  "select-none",
  "group",
  "relative",
  "w-full",
  "cursor-pointer",
  "rounded-input",
  "border",
  "border-input-border",
  "bg-input-bg",
  "py-input-y",
  "px-input-x",

  "text-left",
  "text-input-size",
  "text-input-text",
  "focus:outline-none",
]
</script>

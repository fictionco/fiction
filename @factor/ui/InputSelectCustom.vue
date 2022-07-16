<template>
  <div @click.stop @keyup.stop @keydown.stop>
    <div
      class="relative"
      @keydown.down.prevent="
        hovered = hovered == li.length - 1 ? 0 : hovered + 1
      "
      @keydown.up.prevent="hovered = hovered ? hovered - 1 : 0"
      @keydown.enter.prevent="!active ? toggle() : selectByIndex(hovered)"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        :aria-expanded="active ? 'true' : 'false'"
        aria-labelledby="listbox-label"
        :class="[
          buttonClasses,
          active || disabled ? 'opacity-50' : 'hover:border-input-edge',
          classButton,
          disabled
            ? 'cursor-not-allowed'
            : 'focus:ring-1 focus:ring-input-primary focus:border-input-primary',
        ]"
        @click="toggle()"
      >
        <span class="flex w-full items-baseline truncate">
          <span class="truncate">{{
            selectedItem?.name || defaultValue || defaultText || "Select"
          }}</span>
          <span
            class="select-description ml-2 truncate text-xs text-input-body-light"
            >{{ selectedItem?.desc }}</span
          >
        </span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 group-hover:text-input-primary"
          :class="active ? 'text-input-primary' : ''"
        >
          <svg
            class="h-5 w-5"
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
      </button>
      <!-- For validation -->
      <input
        class="absolute float-left block h-0 w-0 p-0 opacity-0"
        v-bind="$attrs"
        type="text"
        :value="modelValue"
      />
      <transition
        leave-active-class="transition ease-in duration-100"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="active"
          class="absolute z-50 mt-1 w-full rounded-md bg-white shadow-xl"
        >
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            :aria-activedescendant="`listbox-item-${selectedIndex}`"
            class="max-h-60 overflow-auto rounded-md shadow focus:outline-none"
          >
            <template v-for="(item, i) of li" :key="i">
              <li v-if="item.format == 'divider'" class="">
                <div class="w-full border-t border-input-edge" />
              </li>
              <li
                v-else-if="item.format == 'title'"
                class="mt-4 mb-2 text-input-body-light"
              >
                <div class="px-4 text-xs font-semibold uppercase">
                  {{ item.name }}
                </div>
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                role="option"
                :class="listItemClass(item, i)"
                class="group relative select-none py-input-y px-input-x text-input-size"
                @click="selectValue(item)"
                @mouseover="hovered = i"
              >
                <div class="flex items-baseline truncate" :class="classOption">
                  <span
                    class="shrink-0 truncate"
                    :class="item.desc ? '' : 'w-full'"
                    >{{ item.name }}</span
                  >
                  <span v-if="item.desc" class="ml-2 truncate opacity-50">{{
                    item.desc
                  }}</span>
                  <span
                    v-if="isSelected(item.value)"
                    class="absolute inset-y-0 right-0 flex items-center pr-3"
                    :class="
                      hovered !== i
                        ? 'text-input-primary group-hover:text-white'
                        : ''
                    "
                  >
                    <!-- Heroicon name: check -->
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
import { ListItem, normalizeList, onResetUi, vue, vueRouter } from "@factor/api"

type RouteListItem = ListItem & { route?: vueRouter.RouteLocationRaw }

const props = defineProps({
  modelValue: { type: [Number, String, Boolean], default: "" },
  list: {
    type: Array as vue.PropType<string[] | RouteListItem[]>,
    default: () => [],
  },
  defaultValue: { type: [Number, String, Boolean], default: "" },
  defaultText: { type: String, default: "" },
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
    hovered.value = selectedIndex.value
    active.value = true
  }
}

const isSelected = (value?: string): boolean => {
  return value && props.modelValue == value ? true : false
}

const listItemClass = (item: ListItem, i: number): string => {
  let out = []

  if (item.disabled) {
    out.push("opacity-60")
  } else {
    if (
      (isSelected(item.value) && hovered.value === -1) ||
      hovered.value === i
    ) {
      out.push("bg-input-primary text-input-primary-body font-medium")
    } else if (isSelected(item.value)) {
      out.push("bg-input-base-alt font-medium")
    } else {
      out.push("font-normal")
    }
    out.push(
      "cursor-pointer focus:text-white focus:bg-input-primary hover:text-white hover:bg-input-primary",
    )
  }

  return out.join(" ")
}

const buttonClasses = [
  "f-input",
  "group",
  "relative",
  "w-full",
  "cursor-pointer",
  "rounded-md",
  "border",
  "border-input-edge",
  "bg-input-base",
  "py-input-y",
  "pl-3",
  "pr-8",
  "text-left",
  "text-input-size",
  "text-input-body",
  "focus:outline-none",
]
</script>
<style lang="less" scoped>
.select-description {
  max-width: 60%;
}
</style>

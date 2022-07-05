<template>
  <label class="block" @click.stop @keyup.stop @keydown.stop>
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
        :class="buttonClasses"
        @click.prevent="toggle()"
      >
        <span class="flex w-full flex-wrap items-center">
          <span v-if="selected.length === 0" class="truncate">Select</span>
          <div
            v-for="(v, i) in selected"
            v-else
            :key="i"
            class="my-1 mr-2 inline-flex select-none justify-center overflow-hidden rounded-lg border border-input-edge bg-input-base text-xs text-input-body shadow-sm"
            @click.stop
          >
            <div
              class="max-w-full flex-initial px-input-x py-input-y font-medium leading-none"
            >
              {{ getItemName(v) }}
            </div>
            <div
              class="flex cursor-pointer flex-col justify-center border-l border-input-edge px-1 hover:bg-input-base-alt"
              @click.stop.prevent="removeValue(v)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </div>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 group-hover:text-input-primary"
            :class="active ? 'text-input-primary' : 'text-input-body'"
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
        </span>
      </button>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="active"
          class="absolute z-50 mt-1 w-full rounded-md bg-white shadow-xl ring-1 ring-black/5"
        >
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            class="max-h-60 overflow-auto rounded-md shadow focus:outline-none"
          >
            <template v-for="(item, i) of li" :key="i">
              <li v-if="item.format == 'divider'">
                <div class="w-full border-t border-input-edge" />
              </li>
              <li
                v-else-if="item.format == 'title'"
                class="mt-4 mb-2 text-input-edge"
              >
                <div class="px-4 text-xs font-semibold uppercase">
                  {{ item.name }}
                </div>
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                :key="i"
                role="option"
                :class="listItemClass(item, i)"
                class="group relative select-none py-input-y px-input-x text-input-size"
                @click.prevent="selectValue(item)"
                @mouseover="hovered = i"
                @mouseleave="hovered = -1"
              >
                <div class="flex items-center">
                  <span class="truncate">{{ item.name }}</span>
                  <span v-if="item.desc" class="ml-2 truncate opacity-60">{{
                    item.desc
                  }}</span>
                  <span
                    v-if="isSelected(item.value)"
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                    :class="
                      hovered > -1 && hovered !== i
                        ? 'text-input-primary group-hover:text-input-primary-body'
                        : ''
                    "
                  >
                    <!-- Heroicon name: check -->
                    <div class="rounded-full bg-primary-500 p-0.5 text-white">
                      <svg
                        class="h-4 w-4"
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
                    </div>
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </label>
</template>
<script lang="ts" setup>
import { normalizeList, resetUi, onResetUi, vue, vueRouter } from "@factor/api"
import { ListItem } from "@factor/api/types"

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => {} },
})

const emit = defineEmits(["update:modelValue"])
const router = vueRouter.useRouter()
const active = vue.ref(false)
const hovered = vue.ref(-1)

const li = vue.computed(() => {
  return normalizeList(props.list ?? ["no items"]).filter(
    (_) => _.value || _.format,
  )
})

const val = vue.computed<string[]>(() => {
  return typeof props.modelValue == "string"
    ? props.modelValue.split(",").map((_) => _.trim())
    : (props.modelValue as string[])
})

const selected = vue.computed<string[]>({
  get: () => {
    return val.value ?? []
  },
  set: (v) => {
    emit("update:modelValue", v)
  },
})

const removeValue = (value: string): void => {
  const index = selected.value.indexOf(value)
  if (index > -1) {
    selected.value.splice(index, 1)
    selected.value = [...selected.value]
  }
}
const selectValue = async (
  item: ListItem & { route?: string },
): Promise<void> => {
  if (item.disabled) return
  const val = item.value ?? ""
  if (item.route) {
    await router.push(item.route)
  } else if (!selected.value.includes(val)) {
    selected.value = [...selected.value, val]
  } else {
    removeValue(val)
  }
}

const getItemName = (val: string): string | undefined => {
  return li.value.find((_) => _.value == val)?.name || val
}

const isSelected = (value?: string): boolean => {
  return value ? selected.value.includes(value) : false
}

const reset = (): void => {
  hovered.value = -1
  resetUi()
}

const listItemClass = (item: ListItem, i: number): string => {
  let out = []
  const val = item.value ?? ""

  if (item.disabled) {
    out.push("text-input-edge")
  } else {
    if (hovered.value === i) {
      out.push("bg-input-primary text-input-primary-body font-medium ")
    } else if (isSelected(val)) {
      out.push("bg-input-base-alt font-medium text-input-body")
    } else {
      out.push("font-normal")
    }
    out.push(
      "cursor-pointer   hover:text-input-primary-body hover:bg-input-primary",
    )
  }

  return out.join(" ")
}

/**
 * Select by index in list
 */
const selectByIndex = async (index: number): Promise<void> => {
  const v = li.value[index]
  if (v) {
    await selectValue(v)
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
  if (active.value) {
    reset()
  } else {
    active.value = true
  }
}

const buttonClasses = [
  "group",
  "relative",
  "w-full",
  "cursor-pointer",
  "rounded-lg",
  "border",
  "border-input-edge",
  "py-input-y",
  "pl-input-x",
  "pr-10",
  "text-left",
  "text-input-size",
  "bg-input-base",
  "text-input-body",
  "hover:border-input-edge",
  "hover:bg-input-base-alt",
  "focus:border-input-primary",
  "focus:outline-none",
  "focus:ring-1",
  "focus:ring-input-primary",
]
</script>

<style scoped lang="less">
.top-100-plus-10 {
  top: calc(100% + 10px);
}
</style>

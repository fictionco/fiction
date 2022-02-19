<template>
  <label class="block mt-4 max-w-prose" @click.stop @keyup.stop @keydown.stop>
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
        class="group relative w-full rounded-md pl-3 pr-10 py-2 text-left cursor-pointer border border-slate-400 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        @click.prevent="toggle()"
      >
        <span class="w-full flex items-center flex-wrap">
          <span v-if="selected.length === 0" class="truncate">Select</span>
          <div
            v-for="(val, i) in selected"
            v-else
            :key="i"
            class="select-none inline-flex text-xs justify-center mr-2 my-1 rounded-lg overflow-hidden bg-white border border-slate-400 text-slate-800"
            @click.stop
          >
            <div class="font-medium leading-none max-w-full flex-initial p-2">
              {{ getItemName(val) }}
            </div>
            <div
              class="flex flex-col justify-center px-1 border-l border-slate-300 hover:bg-slate-50 text-slate-400 cursor-pointer"
              @click.stop.prevent="removeValue(val)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
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
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none group-hover:text-primary-500"
            :class="active ? 'text-primary-500' : 'text-slate-500'"
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
          class="z-50 absolute mt-1 w-full rounded-md bg-white shadow-xl"
        >
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            class="max-h-60 overflow-auto rounded-md shadow focus:outline-none"
          >
            <template v-for="(item, i) of li" :key="i">
              <li v-if="item.format == 'divider'">
                <div class="w-full border-t border-slate-200" />
              </li>
              <li
                v-else-if="item.format == 'title'"
                class="mt-4 mb-2 text-slate-300"
              >
                <div class="uppercase text-xs font-semibold px-4">
                  {{ item.name }}
                </div>
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                :key="i"
                role="option"
                :class="listItemClass(item, i)"
                class="group select-none relative py-2 px-4"
                @click.prevent="selectValue(item)"
                @mouseover="hovered = i"
              >
                <div class="flex items-center">
                  <template v-if="item.icon">
                    <span
                      v-if="item.icon.includes('svg')"
                      class="h-6 w-6 mr-2"
                      v-html="item.icon"
                    />
                    <img
                      :src="item.icon"
                      class="shrink-0 h-6 w-6 mr-2 rounded-full"
                    />
                  </template>

                  <span class="truncate">{{ item.name }}</span>
                  <span
                    v-if="item.desc"
                    class="ml-2 text-sm truncate opacity-60"
                    >{{ item.desc }}</span
                  >
                  <span
                    v-if="isSelected(item.value)"
                    class="absolute inset-y-0 right-0 flex items-center pr-4"
                    :class="
                      hovered > -1 && hovered !== i
                        ? 'text-primary-500 group-hover:text-white'
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
  </label>
</template>
<script lang="ts" setup>
import { normalizeList, resetUi, onResetUi } from "@factor/api"
import { ListItem } from "@factor/types"
import { computed, PropType, ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  list: { type: Array as PropType<ListItem[]>, default: () => {} },
})

const emit = defineEmits(["update:modelValue"])
const router = useRouter()
const active = ref(false)
const hovered = ref(-1)

const li = computed(() => {
  return normalizeList(props.list ?? ["no items"]).filter(
    (_) => _.value || _.format,
  )
})

const val = computed<string[]>(() => {
  return typeof props.modelValue == "string"
    ? props.modelValue.split(",").map((_) => _.trim())
    : (props.modelValue as string[])
})

const selected = computed<string[]>({
  get: () => {
    return val.value
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
  return li.value.find((_) => _.value == val)?.name
}

const isSelected = (value: string): boolean => {
  return selected.value.includes(value)
}

const reset = () => {
  hovered.value = -1
  resetUi()
}

const listItemClass = (item: ListItem, i: number): string => {
  let out = []

  if (item.disabled) {
    out.push("text-slate-300")
  } else {
    if (
      (isSelected(item.value) && hovered.value === -1) ||
      hovered.value === i
    ) {
      out.push("bg-primary-600 text-white font-medium")
    } else if (isSelected(item.value)) {
      out.push("bg-slate-50 font-medium")
    } else {
      out.push("font-normal")
    }
    out.push(
      "cursor-pointer focus:text-white focus:bg-primary-500 hover:text-white hover:bg-primary-500",
    )
  }

  return out.join(" ")
}

/**
 * Select by index in list
 */
const selectByIndex = async (index: number) => {
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
</script>

<style scoped lang="less">
.top-100-plus-10 {
  top: calc(100% + 10px);
}
</style>

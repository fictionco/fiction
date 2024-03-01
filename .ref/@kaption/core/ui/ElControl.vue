<script lang="ts" setup>
import type { ListItem } from '@factor/api'
import { onResetUi, resetUi, vue } from '@factor/api'
import ElButton from './ElButton.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  list: {
    type: Array as vue.PropType<ListItem[]>,
    default: () => [],
  },
  defaultName: { type: String, default: 'select' },
  defaultValue: { type: String, default: undefined },
  alignDropdown: { type: String, default: 'right' },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string | number | undefined): void
}>()
const active = vue.ref(false)
const selected = vue.computed(() => {
  const val = props.modelValue || props.defaultValue
  const item = props.list.find(i => i.value === val)
  return item ? item.name : props.defaultName
})

function show(): void {
  resetUi()

  active.value = true
}

onResetUi(() => (active.value = false))

function select(item: ListItem) {
  emit('update:modelValue', item.value)
  resetUi()
}
</script>

<template>
  <div class="relative inline-block w-auto" @click.stop>
    <ElButton btn="default" @click.prevent="show()">
      <span class="font-medium capitalize">{{ selected }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ml-1 -mr-1 h-4 w-4 opacity-40"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </ElButton>
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="active"
        class="absolute top-full left-0 z-30 mt-2 w-screen max-w-[200px] rounded-md bg-white shadow-xl ring-1 ring-black/5 lg:max-w-xs"
        :class="
          alignDropdown === 'left'
            ? 'left-0 origin-top-left'
            : 'right-0 origin-top-right'
        "
      >
        <div
          class="select-none overflow-auto rounded-md shadow focus:outline-none"
        >
          <div class="sel">
            <nav
              class="flex flex-col justify-start overflow-x-hidden overflow-y-scroll py-2 md:justify-center"
            >
              <a
                v-for="(item, i) in list"
                :key="i"
                class="group flex cursor-pointer flex-col items-baseline justify-between px-4 py-2 text-base font-normal hover:bg-primary-500 hover:text-white lg:flex-row lg:text-sm"
                :class="
                  item.value === modelValue ? 'bg-theme-100 text-theme-700' : ''
                "
                @click="select(item)"
              >
                <div class="whitespace-nowrap font-semibold capitalize">
                  {{ item.name }}
                </div>
                <div v-if="item.desc" class="text-xs opacity-70">
                  {{ item.desc }}
                </div>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onResetUi, resetUi, vue } from '../../utils'
import type { ListItem } from '../../types'

const props = defineProps({
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  theme: { type: String as vue.PropType<'select' | 'dropdown'>, default: '' },
  activeId: { type: String, default: '' },
  itemType: {
    type: String as vue.PropType<'Organization' | 'Project'>,
    default: '',
  },
})
const emit = defineEmits(['select'])
const active = vue.ref(false)

onResetUi(() => {
  active.value = false
})

function activate(): void {
  if (active.value) {
    active.value = false
  }
  else {
    resetUi({ scope: 'all', cause: 'NavSelectProject' })
    active.value = true
  }
}

const activeItem = vue.computed<ListItem | undefined>(() => {
  const found = props.list.find((item: ListItem) => {
    return item.id === props.activeId
  })

  return found
})

async function selectItem(item: ListItem): Promise<void> {
  emit('select', item)
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
      class="hover:bg-theme-100 relative w-full cursor-pointer rounded-md border bg-white py-1.5 pl-2 pr-10 text-left text-sm focus:outline-none"
      :class="
        theme === 'select'
          ? 'border-slate-300 hover:border-slate-500'
          : 'border-transparent'
      "
      @click.stop="activate()"
    >
      <span v-if="activeItem" class="flex items-center space-x-2">
        <img
          v-if="activeItem.avatar"
          class="h-5 w-5 rounded-md"
          :src="activeItem.avatar"
        >
        <div
          v-else
          class="text-theme-500 flex h-5 w-5 items-center justify-center rounded-full p-1 group-hover:text-primary-500"
          v-html="activeItem.icon"
        />
        <span class="block truncate font-medium">
          {{ activeItem.name }}
        </span>
      </span>

      <span v-else class="text-theme-500 flex items-center space-x-2">
        <div
          class="text-theme-500 flex h-5 w-5 items-center justify-center rounded-full p-1 group-hover:text-primary-500"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <span class="block truncate font-medium">Select {{ itemType }}</span>
      </span>

      <span
        class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="text-theme-400 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        class="absolute left-1/2 z-50 w-screen max-w-xs -translate-x-1/2 md:w-72 md:max-w-none"
        :style="{ top: 'calc(100% + 8px)' }"
      >
        <div
          v-show="active"
          class="text-theme-900 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div
            class="absolute inset-x-2/4 -top-1 -ml-2.5 h-5 w-5 rotate-45 rounded bg-white shadow ring-1 ring-black/20"
          />
          <div class="relative bg-white">
            <ul class="divide-y border-slate-200">
              <li
                v-for="item in list"
                :key="item.id"
                class="bg-white"
              >
                <div
                  class="hover:bg-theme-100 group relative cursor-pointer py-3 px-4 hover:text-primary-500"
                  :class="
                    activeItem?.id === item.id
                      ? 'bg-theme-50 text-primary-500 font-semibold'
                      : ''
                  "
                  @click="selectItem(item)"
                >
                  <div class="flex items-center space-x-3">
                    <img
                      v-if="item.avatar"
                      class="h-5 w-5 rounded-md"
                      :src="item.avatar"
                    >
                    <div
                      v-else
                      class="text-theme-500 flex h-5 w-5 items-center justify-center rounded-full p-1 group-hover:text-primary-500"
                      :class="
                        activeItem?.id === item.id ? 'text-primary-500' : ''
                      "
                      v-html="item.icon"
                    />
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

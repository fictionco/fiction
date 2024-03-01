<script lang="ts" setup>
import type { ListItem } from '@factor/api'
import { onResetUi, vue } from '@factor/api'

defineProps({
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  direction: { type: String, default: 'right' },
  vertical: { type: String as vue.PropType<'up' | 'down'>, default: 'down' },
})

const emit = defineEmits<{
  (event: 'select', payload: ListItem): void
  (event: 'update', payload: ListItem): void
}>()

const active = vue.ref(false)

onResetUi(() => {
  active.value = false
})

const activeActions = vue.ref()
function showActions(val: string | number | undefined) {
  activeActions.value = val
}
</script>

<template>
  <div class="relative ml-auto">
    <template v-if="$slots.default">
      <div @click.stop="active = !active">
        <slot :active="active" />
      </div>
    </template>
    <button
      v-else
      id="options-menu-0-button"
      type="button"
      class="-m-1.5 block rounded-md p-1.5 transition-all hover:opacity-70"
      :class="active ? 'rotate-90' : ''"
      aria-expanded="false"
      aria-haspopup="true"
      @click.stop="active = !active"
    >
      <span class="sr-only">Open options</span>
      <svg
        class="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
        />
      </svg>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="active"
        class="absolute z-30 w-56 origin-top-right overflow-hidden rounded-md bg-white py-2 text-slate-800 shadow-xl ring-1 ring-black/10 focus:outline-none"
        :class="[
          direction === 'left' ? 'right-0' : 'left-0',
          vertical === 'up' ? 'bottom-full mb-1' : 'top-full mt-1',
        ]"
      >
        <div
          class="divide-y divide-slate-100"
          role="none"
          @click.stop
        >
          <template v-for="(item, i) in list" :key="i">
            <component
              :is="item.component"
              v-if="item.component"
              @update="emit('update', item)"
            />
            <div v-else-if="item.value === 'divider'" class="">
              <div class="w-full border-t border-slate-200" />
            </div>
            <div v-else-if="item.value === 'title'" class="">
              <div
                class="my-2 mb-1 px-4 text-sm font-bold uppercase text-slate-400"
              >
                {{ item.name }}
              </div>
            </div>
            <div
              v-else
              class="flex grow cursor-pointer items-center justify-between space-x-2 px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-700"
              :class="[
                item.selected ? 'bg-slate-100' : '',
                item.isDisabled ? 'cursor-not-allowed opacity-50' : '',
                item.isHidden ? 'hidden' : '',
                item.actions && activeActions === item.value
                  ? 'bg-slate-100'
                  : '',
              ]"
              @click="
                item.actions
                  ? showActions(item.value)
                  : item.callback
                    ? item.callback()
                    : ''
              "
            >
              <div
                class="flex items-center space-x-2 truncate whitespace-nowrap"
              >
                <div>{{ item.name }}</div>
                <div v-if="item.frontIcon" :class="item.frontIcon" />
              </div>
              <div class="flex space-x-2">
                <slot
                  v-if="$slots.avatar"
                  name="avatar"
                  :item="item"
                />
                <div v-else-if="item.icon">
                  <div :class="item.icon" />
                </div>
                <div v-if="item.actions">
                  <div class="i-heroicons-chevron-down" />
                </div>
              </div>
            </div>
            <div v-if="activeActions === item.value" class="pb-4 text-xs">
              <div
                v-for="(action, ii) in item.actions"
                :key="ii"
                class="hover:text-primary-500 flex items-center justify-between space-x-2 py-2 pl-6 pr-3 font-semibold hover:bg-slate-100"
                @click.stop="action.callback ? action.callback() : ''"
              >
                <div>{{ action.name }}</div>
                <div :class="action.icon" class="text-sm" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

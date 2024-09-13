<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { vue } from '@fiction/core'

defineProps({
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'select', payload: ListItem): void
  (event: 'update', payload: ListItem): void
}>()
const activeActions = vue.ref()
function showActions(val: string | number | undefined) {
  activeActions.value = val
}
</script>

<template>
  <div class="relative z-20 font-sans">
    <div
      v-if="loading"
      class="text-primary-500 absolute inset-0 flex flex-col items-center justify-center bg-white"
    >
      <svg
        class="h-6 w-6 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    <div
      class="text-theme-700"
      :class="loading ? 'opacity-0' : ''"
      role="none"
    >
      <template v-for="(item, i) in list" :key="i">
        <component
          :is="item.component"
          v-if="item.component"
          @update="emit('update', item)"
        />
        <div v-else-if="item.value === 'divider'" class="">
          <div class="border-theme-200 w-full border-t" />
        </div>
        <div v-else-if="item.value === 'title'" class="">
          <div
            class="text-theme-400 my-2 mb-1 px-4 text-sm font-bold uppercase"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          v-else
          class="text-theme-700 hover:bg-theme-100 py-input-y px-input-x text-input-size flex grow cursor-pointer items-center justify-between space-x-2 font-semibold"
          :class="[
            item.selected ? 'bg-theme-100' : '',
            item.isDisabled ? 'cursor-not-allowed opacity-50' : '',
            item.isHidden ? 'hidden' : '',
            item.actions && activeActions === item.value ? 'bg-theme-100' : '',
          ]"
          @click="item.actions ? showActions(item.value) : emit('select', item)"
        >
          <div class="flex items-center space-x-2 truncate whitespace-nowrap">
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
            class="hover:text-primary-500 hover:bg-theme-100 flex items-center justify-between space-x-2 py-2 pl-6 pr-3 font-semibold"
            @click.stop="action.callback ? action.callback() : ''"
          >
            <div>{{ action.name }}</div>
            <div :class="action.icon" class="text-sm" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

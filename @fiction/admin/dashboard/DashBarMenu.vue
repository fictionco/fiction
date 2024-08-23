<script lang="ts" setup>
import type { IndexItem, ListItem } from '@fiction/core'
import { getNavComponentType, onResetUi, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import type { Site } from '../../site'

defineProps({
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  direction: { type: String, default: 'right' },
  vertical: { type: String as vue.PropType<'up' | 'down'>, default: 'down' },
  accountMenu: { type: Array as vue.PropType<IndexItem[]>, default: () => [] },
  site: { type: Object as vue.PropType<Site>, required: true },
})
defineEmits<{
  (event: 'select', payload: ListItem): void
  (event: 'update', payload: ListItem): void
}>()
const { fictionUser } = useService()
const active = vue.ref(false)

onResetUi(() => {
  active.value = false
})
</script>

<template>
  <div class="relative ml-auto">
    <div @click.stop="active = !active">
      <div class="group flex cursor-pointer items-center space-x-1 hover:bg-theme-50 dark:border-theme-700 dark:bg-theme-700 dark:hover:bg-theme-700/60 px-1.5 py-1 rounded-full">
        <ElAvatar
          class=" h-9 w-9 rounded-full ring-2 ring-black/90 dark:ring-theme-0"
          :class="active ? 'opacity-70' : ''"
          :email="fictionUser.activeUser.value?.email"
        />
        <div
          class="text-lg i-tabler-chevron-down transition-all"
          :class="active ? 'transform rotate-180' : ''"
        />
      </div>
    </div>

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
        class="absolute z-30 w-80 origin-top-right overflow-hidden rounded-md bg-white dark:bg-theme-800  text-theme-800 dark:text-theme-0 shadow-xl border border-theme-200 dark:border-theme-700 focus:outline-none"
        :class="[
          direction === 'left' ? 'right-0' : 'left-0',
          vertical === 'up' ? 'bottom-full mb-1' : 'top-full mt-1',
        ]"
      >
        <div
          v-if="fictionUser.activeUser.value"
          class="border-theme-200 dark:border-theme-700 flex items-center space-x-3 border-b px-4 py-4 text-sm"
        >
          <div>
            <ElAvatar
              class="ring-theme-300 dark:ring-theme-0 h-10 w-10 rounded-full ring-2"
              :email="fictionUser.activeUser.value?.email"
            />
          </div>
          <div>
            <div class="text-sm text-slate-400">
              Signed in as...
            </div>
            <p class="truncate text-lg font-bold leading-tight">
              {{ fictionUser.activeUser.value?.fullName || fictionUser.activeUser.value?.email }}
            </p>
          </div>
        </div>
        <div
          class="p-2"
          role="none"
          @click.stop
        >
          <template v-for="(item, i) in accountMenu" :key="i">
            <component
              :is="getNavComponentType(item)"
              class=" flex grow cursor-pointer items-center justify-between space-x-2 px-3 py-2 font-medium group"
              :class="item.href || item.onClick ? 'hover:text-primary-500 dark:hover:text-primary-300' : ''"
              :to="item.href"
              :href="item.href"
              @click="item.onClick ? item.onClick({ event: $event }) : ''"
            >
              <div
                class="flex items-center space-x-4 truncate whitespace-nowrap w-full"
              >
                <div
                  v-if="item.icon"
                  class="text-xl text-theme-500 dark:text-theme-100 "
                  :class="[item.icon, item.href || item.onClick ? 'group-hover:text-primary-500 group-hover:dark:text-primary-500 dark:group-hover:text-primary-300' : '']"
                />
                <div class="text-base">
                  {{ item.name }}
                </div>
                <div v-if="item.figure?.el" class="flex justify-end grow">
                  <component :is="item.figure?.el" :site="site" />
                </div>
              </div>
            </component>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

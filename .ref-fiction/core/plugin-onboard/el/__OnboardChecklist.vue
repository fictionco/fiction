<script lang="ts" setup>
import { localRef, vue } from '@factor/api'
import { useFictionApp } from '../../util'

import type { OnboardItem } from '../schema'

const { fictionOnboard } = useFictionApp()
const vis = localRef({ key: 'KOnboardVis', def: false, lifecycle: 'local' })
const selectedIndex = localRef({
  key: 'KOnboardSel',
  def: -1,
  lifecycle: 'local',
})

const formName = 'Installation &amp; Setup'

const items = vue.computed<OnboardItem[]>(() => {
  const items = fictionOnboard.onboardItems.value

  return items.map((item, ind) => {
    return { ...item, selected: ind === selectedIndex.value }
  })
})

const numberIncomplete = vue.computed(() => {
  return items.value.filter(item => !item.completed).length
})
</script>

<template>
  <div v-if="numberIncomplete > 0" class="absolute bottom-4 right-4">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <span
        v-if="!vis"
        class="absolute bottom-0 right-0"
        @click="vis = true"
      >
        <button
          type="button"
          class="bg-theme-800 shadow-real hover:bg-theme-900 focus:border-primary-500 focus:ring-primary-500 relative inline-flex items-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white ring-1 ring-black/10 focus:z-10 focus:outline-none focus:ring-1"
          v-html="formName"
        />

        <span
          v-if="numberIncomplete > 0"
          class="bg-primary-500 text-primary-100 shadow-real-low absolute -top-3 -left-3 z-20 inline-flex items-center justify-center rounded-full py-1.5 px-2 text-[11px] font-bold leading-none"
        >{{ numberIncomplete }}</span>
      </span>
      <div
        v-else
        class="absolute bottom-0 right-0 z-10"
        role="dialog"
        aria-modal="true"
      >
        <div class="inset-0 z-10">
          <div
            class="shadow-real w-80 max-w-sm divide-y divide-slate-100 overflow-hidden rounded-md bg-white ring-1 ring-black/10 transition-all"
          >
            <div
              class="text-theme-600 flex items-center justify-between p-2 text-xs"
            >
              <div class="text-theme-400" v-html="formName" />
              <div>
                <div
                  class="i-carbon-close hover:text-primary-500 cursor-pointer text-xl"
                  @click="vis = false"
                />
              </div>
            </div>

            <ul
              id="options"
              class="max-h-96 scroll-py-3 overflow-y-auto"
              role="listbox"
            >
              <!-- Active: "bg-theme-100" -->
              <li
                v-for="(item, i) in items"
                id="option-1"
                :key="i"
                class="group flex select-none p-3"
                :class="
                  item.selected
                    ? 'bg-theme-100'
                    : 'cursor-pointer hover:text-primary-500'
                "
                role="option"
                tabindex="-1"
                @click="selectedIndex = i"
              >
                <div
                  class="flex h-5 w-5 flex-none items-center justify-center rounded-full"
                  :class="
                    item.completed
                      ? 'bg-theme-700 text-theme-200'
                      : item.selected
                        ? 'bg-primary-500 text-white'
                        : 'bg-theme-200 text-theme-500'
                  "
                >
                  <div
                    class="pointer-events-none text-sm"
                    :class="item.completed ? 'i-carbon-checkmark' : item.icon"
                  />
                </div>
                <div class="ml-4 mt-1 flex-auto text-xs">
                  <div class="flex justify-between">
                    <p
                      class="font-bold"
                      :class="item.completed ? 'line-through' : ''"
                    >
                      {{ item.name }}
                    </p>
                    <div
                      :class="
                        item.selected
                          ? 'i-carbon-chevron-up'
                          : 'i-carbon-chevron-down'
                      "
                    />
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

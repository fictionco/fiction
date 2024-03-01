<script lang="ts" setup>
import { localRef, vue } from '@factor/api'
import { useKaption } from '../../utils'
import type { OnboardItem } from '../schema'

const { kaptionOnboard } = useKaption()
const vis = localRef({ key: 'KOnboardVis', def: false, lifecycle: 'local' })
const selectedIndex = localRef({
  key: 'KOnboardSel',
  def: -1,
  lifecycle: 'local',
})

const formName = 'Installation &amp; Setup'

const items = vue.computed<OnboardItem[]>(() => {
  const items = kaptionOnboard.getOnboardItems()

  return items.map((item, ind) => {
    return { ...item, selected: ind === selectedIndex.value }
  })
})

const numberIncomplete = vue.computed(() => {
  return items.value.filter(item => !item.completed?.value).length
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
          class="relative inline-flex items-center whitespace-nowrap rounded-md bg-theme-800 px-4 py-2 text-sm font-medium text-white shadow-real ring-1 ring-black/10 hover:bg-theme-900 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          v-html="formName"
        />

        <span
          v-if="numberIncomplete > 0"
          class="absolute -top-3 -left-3 z-20 inline-flex items-center justify-center rounded-full bg-primary-500 py-1.5 px-2 text-[11px] font-bold leading-none text-primary-100 shadow-real-low"
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
            class="w-80 max-w-sm divide-y divide-slate-100 overflow-hidden rounded-md bg-white shadow-real ring-1 ring-black/10 transition-all"
          >
            <div
              class="text-theme-600 flex items-center justify-between p-2 text-xs"
            >
              <div class="text-theme-400" v-html="formName" />
              <div>
                <div
                  class="i-carbon-close cursor-pointer text-xl hover:text-primary-500"
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
                    item.completed?.value
                      ? 'bg-theme-700 text-theme-200'
                      : item.selected
                        ? 'bg-primary-500 text-white'
                        : 'bg-theme-200 text-theme-500'
                  "
                >
                  <div
                    class="pointer-events-none text-sm"
                    :class="
                      item.completed?.value ? 'i-carbon-checkmark' : item.icon
                    "
                  />
                </div>
                <div class="ml-4 mt-1 flex-auto text-xs">
                  <div class="flex justify-between">
                    <p
                      class="font-bold"
                      :class="item.completed?.value ? 'line-through' : ''"
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
                  <div v-if="item.selected">
                    <div class="mt-2 text-[11px]">
                      {{ item.desc }}
                      <div v-if="item.tasks" class="mt-2">
                        <div
                          v-for="(task, ii) in item.tasks.value"
                          :key="ii"
                          class="mb-1 text-[11px]"
                        >
                          <div class="flex space-x-2">
                            <div class="pt-0.5">
                              <div
                                class=" "
                                :class="
                                  task.completed
                                    ? `i-carbon-checkmark`
                                    : `i-carbon-circle-dash`
                                "
                              />
                            </div>
                            <div>
                              <div class="font-semibold">
                                {{ task.text }}
                              </div>
                              <div class="text-theme-400">
                                {{ task.value }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.link" class="mt-3">
                      <RouterLink
                        :to="item.link"
                        class="font-semibold text-primary-500"
                      >
                        <span v-if="!item.completed?.value">Setup</span><span v-else>Go</span> &rarr;
                      </RouterLink>
                    </div>
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

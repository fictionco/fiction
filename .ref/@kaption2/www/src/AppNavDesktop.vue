<script lang="ts" setup>
import type { FactorRouter } from '@factor/api'
import { onResetUi, resetUi, useService, vue } from '@factor/api'
import { darkMode } from './util'
import { featureNav } from './featureNav'

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()

const dropdownVisible = vue.ref<string>('')
async function goToPath(path?: string): Promise<void> {
  if (!path)
    return

  resetUi()

  await factorRouter.router.push({ path })
}

function showDropdown(dd: string): void {
  dropdownVisible.value = dd
}

onResetUi(() => {
  showDropdown('')
})
</script>

<template>
  <template v-for="navItem in featureNav" :key="navItem.path">
    <RouterLink
      v-if="navItem.subMenu === null"
      :to="navItem.path"
      class="rounded-md px-3 py-1 font-semibold"
      :class="[
        darkMode ? 'hover:text-theme-300 text-white' : `hover:text-primary-500`,
      ]"
      :exact-active-class="darkMode ? 'text-primary-200' : 'bg-theme-50'"
    >
      <span>{{ navItem.name }}</span>
    </RouterLink>
    <div
      v-else
      class="relative"
      @mouseover="showDropdown(navItem.name)"
      @mouseleave="showDropdown('')"
      @click="factorRouter.router.push(navItem.subMenu?.[0].path ?? '')"
    >
      <button
        type="button"
        class="group inline-flex items-center rounded-md px-2 py-3 font-semibold focus:outline-none"
        :class="[
          navItem.visDropdown ? 'opacity-100' : '',
          darkMode
            ? 'hover:text-primary-200 text-white'
            : 'hover:text-primary-500',
        ]"
      >
        <span>{{ navItem.name }}</span>
        <span
          class="ml-1 h-4 w-4 transition-all"
          :class="navItem.visDropdown ? 'rotate-180' : 'rotate-0'"
          v-html="navItem.icon"
        />
      </button>

      <transition
        enter-active-class="transition ease-in duration-150"
        enter-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-0"
        leave-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-show="dropdownVisible === navItem.name"
          class="absolute left-1/2 -translate-x-1/2 px-2 sm:px-0"
          :class="[
            navItem.subMenuGrid ? 'w-screen max-w-sm' : 'w-64',
            navItem.visDropdown ? 'z-50' : 'z-30',
          ]"
        >
          <div
            class="text-theme-900 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/20"
          >
            <!-- subMenu triangle -->
            <div
              class="absolute inset-x-2/4 -top-2 -ml-2.5 h-5 w-5 rotate-45 rounded bg-white shadow ring-1 ring-black/20"
            />
            <!-- subMenu grid -->
            <div
              v-if="navItem.subMenuGrid"
              class="relative gap-6 divide-y divide-slate-200 bg-white"
            >
              <a
                v-for="(subMenuItem, ii) in navItem.subMenu"
                :key="ii"
                :href="subMenuItem.path"
                class="hover:bg-theme-50 group flex cursor-pointer rounded-md p-4 transition-colors"
                @click.stop.prevent="goToPath(subMenuItem.path)"
              >
                <span class="block w-6 shrink-0 py-1 text-right">
                  <span
                    class="inline-block h-4 w-4 text-theme-500"

                    v-html="subMenuItem.icon"
                  />
                </span>

                <p class="ml-4">
                  <span class="block text-base font-bold">
                    {{ subMenuItem.name }}
                  </span>
                  <span
                    v-if="subMenuItem.tagline"
                    class="text-theme-500 block text-base"
                  >
                    {{ subMenuItem.tagline }}
                  </span>
                </p>
              </a>
            </div>
            <!-- subMenu list -->
            <div v-else class="relative bg-white px-5 py-6 sm:p-8">
              <template
                v-for="subMenuItem in navItem.subMenu"
                :key="subMenuItem.name"
              >
                <a
                  v-if="subMenuItem.path"
                  :href="subMenuItem.path"
                  class="hover:text-primary-500 block py-2"
                >
                  {{ subMenuItem.name }}
                </a>
                <div
                  v-else
                  class="text-theme-300 pt-4 text-xs font-semibold uppercase tracking-wider"
                >
                  {{ subMenuItem.heading }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
</template>

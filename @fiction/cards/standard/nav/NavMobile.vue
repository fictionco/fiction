<script lang="ts" setup>
import type { FictionAdmin } from '@fiction/admin'
import type { NavListItem } from '@fiction/core'
import { getFictionAuthUrl, getFictionNavItems } from '@fiction/admin'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import NavMobileItem from './NavMobileItem.vue'
import NavMobilePanel from './NavMobilePanel.vue'

defineOptions({
  name: 'NavMobile',
})

const { vis, nav = [] } = defineProps<{
  vis: boolean
  nav?: NavListItem[]
}>()

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

const { fictionUser, fictionAdmin } = useService<{ fictionAdmin: FictionAdmin }>()
const user = vue.computed(() => fictionUser.activeUser?.value)
const navItems = vue.computed(() => getFictionNavItems({ fictionAdmin, fictionUser }))

const legalItems = vue.computed(() => [
  { label: 'About', href: 'https://www.fiction.com/about' },
  { label: 'Privacy', href: 'https://www.fiction.com/privacy' },
  { label: 'Terms', href: 'https://www.fiction.com/terms' },
])
</script>

<template>
  <NavMobilePanel :vis @update:vis="emit('update:vis', $event)">
    <div class="py-6 flex flex-col justify-start gap-8 h-full">
      <!-- User Profile Section -->
      <div class="px-4 border-b border-theme-200 dark:border-theme-700 bg-theme-900">
        <div class="flex items-center space-x-3 pb-4 ">
          <div>
            <ElAvatar
              class="size-10"
              :user="user"
            />
          </div>
          <div class="font-sans min-w-0 space-y-0.5">
            <div class="truncate font-bold leading-tight">
              {{ user?.fullName || user?.email || 'Sign In' }}
            </div>
            <div class="text-xs text-theme-500 dark:text-theme-400 truncate">
              {{ user?.email || 'Connect Fiction Account' }}
            </div>
          </div>
        </div>
      </div>

      <div class="grow overflow-y-auto flex flex-col gap-8 px-6">
        <div v-if="nav.length" class="space-y-3">
          <h3 class="text-sm font-medium text-theme-400 dark:text-theme-500">
            Site Navigation
          </h3>
          <ul class="space-y-3">
            <li v-for="(item, idx) in nav" :key="idx">
              <NavMobileItem
                :item
                @click="emit('update:vis', false)"
              />
            </li>
          </ul>
        </div>

        <!-- Fiction Navigation Items (when logged in) -->
        <div class="space-y-3">
          <h3 class="text-sm font-medium text-theme-400 dark:text-theme-500">
            Fiction Account
          </h3>
          <ul v-if="user" class="space-y-3">
            <li v-for="(item, idx) in navItems" :key="idx">
              <NavMobileItem
                :item
                @click="emit('update:vis', false)"
              />
            </li>
          </ul>
          <!-- Sign In Button (if not logged in) -->
          <div v-else class="py-2">
            <XButton
              design="solid"
              theme="primary"
              size="md"
              icon-after="i-tabler-arrow-right"
              data-test-id="mobile-sign-in-button"
              :href="getFictionAuthUrl({ fictionAdmin })"
            >
              Sign In
            </XButton>
          </div>
        </div>
      </div>

      <!-- Legal Links -->
      <div class="px-4 py-3 border-t border-theme-100 dark:border-theme-800">
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-theme-500 dark:text-theme-400">
          <a
            v-for="(item, idx) in legalItems"
            :key="idx"
            :href="item.href"
            class="hover:text-theme-700 dark:hover:text-theme-300"
            @click="emit('update:vis', false)"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>
  </NavMobilePanel>
</template>

<script lang="ts" setup>
import { emitEvent, onEvent } from '@factor/api'
import type { MenuGroup, MenuItem } from '@factor/types'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getAccountMenu } from '@kaption/app/src/tools/menus'
import { getRoute } from '@kaption/app'

const router = useRouter()
/**
 * Dropdown visibility
 */
const vis = ref(false)

onEvent('resetUi', () => (vis.value = false))

function toggleVisibility(): void {
  if (!vis.value) {
    emitEvent('resetUi')
    vis.value = true
  }
  else {
    vis.value = false
  }
}

async function handleClick(item: MenuItem) {
  if (item.onClick)
    item.onClick(item)

  if (item.route && item.route.includes('http'))
    window.location.assign(item.route)
  else if (item.route)
    await router.push({ path: item.route })
}
const menuGroups = ref<MenuGroup[]>([
  {
    groupName: 'Manage',
    menu: [
      {
        name: 'Team',
        route: getRoute('team'),
      },
      {
        name: 'Invite Members',
        route: getRoute('team'),
      },
    ],
  },
  {
    groupName: 'Payment',
    menu: [
      {
        name: 'Usage and Billing',
        route: getRoute('billing'),
      },
      {
        name: 'Payment Methods',
        route: getRoute('billingPaymentMethods'),
      },
    ],
  },
  {
    groupName: 'Support',
    menu: [
      {
        name: 'Documentation',
        route: getRoute('docs'),
      },
      {
        name: 'Support',
        route: getRoute('support'),
      },
    ],
  },
  {
    groupName: 'Your Account',
    menu: getAccountMenu(),
  },
])
</script>

<template>
  <div class="hidden sm:inline-block relative text-left">
    <button
      class="inline-flex justify-center items-center rounded-md pl-3 pr-2 py-2 text-base font-medium focus:outline-none focus:ring-primary-500 sm:text-sm hover:text-gray-500 hover:bg-gray-50"
      :class="vis ? `text-primary-500 bg-primary-50` : ``"
      aria-haspopup="true"
      aria-expanded="true"
      @click.stop="toggleVisibility()"
    >
      Menu
      <svg
        class="inline-block -mr-1 ml-1 h-4 w-4 text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    </button>

    <div
      v-if="vis"
      class="origin-top-right absolute z-30 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div
        v-for="(group, i) in menuGroups"
        :key="i"
        class="py-1"
      >
        <div
          class="pt-2 pb-1 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-opacity-40"
        >
          {{ group.groupName }}
        </div>
        <a
          v-for="(item, ii) in group.menu"
          :key="ii"
          :href="item.route"
          class="block px-4 py-2 text-sm cursor-pointer text-gray-500 hover:bg-slate-100 hover:text-gray-900"
          role="menuitem"
          @click.prevent="handleClick(item)"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
</template>

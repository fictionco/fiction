<script lang="ts" setup>
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type {
  FactorRouter,
  FactorUser,
  MenuItem,
} from '@factor/api'
import {
  onResetUi,
  resetUi,
  useService,
  vue,
} from '@factor/api'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const router = factorRouter.router
const accountMenu = [
  {
    name: 'Account Settings',
    link: factorRouter.link('accountSettings'),
  },
  {
    name: 'Organizations',
    link: factorRouter.link('organizationIndex'),
  },
  {
    name: 'Email Support',
    onClick: async (): Promise<void> => {
      window.location.href = 'mailto:hello@fiction.com'
    },
  },
  {
    name: 'Logout',
    onClick: async (): Promise<void> => {
      await factorUser.logout()
    },
  },
]

const vis = vue.ref(false)
async function toggle(): Promise<void> {
  if (!factorUser.activeUser.value?.userId) {
    await router.push(factorRouter.link('authLogin').value)
  }
  else if (vis.value) {
    vis.value = false
  }
  else {
    resetUi({ scope: 'all', cause: 'NavAccount' })
    vis.value = true
  }
}

onResetUi(() => {
  vis.value = false
})

async function clickItem(event: MouseEvent, item: MenuItem): Promise<void> {
  if (item.onClick)
    await item.onClick(event, item)
  else if (item.link)
    await factorRouter.push(item.link.value)
}
</script>

<template>
  <div class="relative font-medium">
    <router-link
      v-if="!factorUser.activeUser.value"
      id="login"
      class="text-theme-900 bg-theme-600 hover:bg-theme-600 flex items-center space-x-3 rounded-full py-1 px-3 focus:outline-none"
      to="/login"
    >
      Login / Signup
    </router-link>
    <button
      v-else
      id="user-menu"
      class="border-theme-300 flex items-center rounded-lg border"
      :class="[
        vis
          ? 'bg-theme-0 text-theme-1000 '
          : 'bg-theme-0 text-theme-800 hover:bg-theme-100',
      ]"
      aria-haspopup="true"
      title="Your Account"
      @click.stop.prevent="toggle()"
    >
      <div class="mr-3 hidden p-0.5 pl-4 font-semibold md:block">
        {{
          factorUser.activeUser.value?.fullName
            ?? factorUser.activeUser.value?.email
            ?? "Log In"
        }}
      </div>

      <ElAvatar
        class="h-7 w-7 rounded-lg"
        :user-id="factorUser.activeUser.value?.userId"
      />
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
        v-show="vis"
        class="divide-theme-200 bg-theme-0 ring-theme-200 absolute right-0 z-30 mt-2 w-72 origin-top-right divide-y rounded-md shadow-lg ring-1 focus:outline-none"
        :style="{ top: 'calc(100% + 20px)' }"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="px-4 py-3 text-sm" role="none">
          <p class="truncate" role="none">
            {{ factorUser.activeUser.value?.email }}
          </p>
          <p class="text-theme-300 mt-1 capitalize" role="none">
            {{ factorUser.activeOrganization.value?.relation?.memberAccess }}
          </p>
        </div>
        <div class="py-1" role="none">
          <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
          <a
            v-for="item in accountMenu"
            id="menu-item-0"
            :key="item.name"
            href="#"
            class="text-theme-700 hover:bg-theme-100 block px-4 py-2 text-sm"
            :class="
              item.link?.value === router.currentRoute.value.path
                ? 'bg-theme-100 text-primary-500 font-semibold'
                : ''
            "
            role="menuitem"
            tabindex="-1"
            @click.prevent="clickItem($event, item)"
          >{{ item.name }}</a>
        </div>
      </div>
    </transition>
  </div>
</template>

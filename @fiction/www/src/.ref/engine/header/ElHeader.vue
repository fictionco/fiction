<script setup lang="ts">
import type {
  FactorRouter,
  FactorUser,
  MenuItem,
} from '@factor/api'
import {
  useService,
  vue,
} from '@factor/api'
import { googleOneTap } from '@factor/api/plugin-user/google'
import ElUi from '@factor/engine/ui/ElUi.vue'
import NavMobile from './NavMobile.vue'
import NavAccount from './NavAccount.vue'

export interface SectionProps {
  icon?: string
  nav?: MenuItem[]
  logoComponent?: vue.Component
  socialList?: {
    key?: string
    path?: string
    target?: string
    name?: string
    icon?: string
  }[]
}

defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})

const { factorUser, factorRouter } = useService<{
  factorUser: FactorUser
  factorRouter: FactorRouter
}>()

function accountMenu() {
  return [
    {
      icon: 'i-carbon-dashboard',
      name: 'Dashboard',
      onClick: async () => {
        await factorRouter.goto('orgHome')
      },
    },
    {
      icon: 'i-carbon-logout',
      name: 'Logout',
      onClick: async () => {
        await factorUser.logout()
      },
    },
  ]
}

const activeUser = factorUser.activeUser
/* Nav visibility */
const vis = vue.ref(false)

const btnClass = `hover:bg-theme-200 cursor-pointer rounded-full px-4 py-1.5 text-sm font-sans font-semibold `

vue.onMounted(async () => {
  const user = await factorUser.userInitialized()

  if (!user) {
    await googleOneTap({
      promptParentId: 'google-signin-prompt',
      factorUser,
      callback: async (r) => {
        const email = r.user?.email
        if (r.user && r.isNew && email) {
          // if (r.code) {
          // }
        }
      },
    })
  }
})
</script>

<template>
  <div>
    <div class="relative z-30">
      <div class="relative p-4 md:p-6 lg:px-8">
        <nav
          class="relative flex items-center justify-between"
          aria-label="Global"
        >
          <div class="flex lg:flex-1">
            <RouterLink
              to="/"
              class="hover:text-primary-600 ui-font-title block rounded-md text-2xl font-bold transition-all"
            >
              <template v-if="settings.logoComponent">
                <component :is="settings.logoComponent" class="h-6" />
              </template>
            </RouterLink>
          </div>
          <div class="flex lg:hidden">
            <button
              type="button"
              class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              @click.stop="vis = !vis"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div
            class="mr-4 hidden lg:flex lg:justify-center lg:gap-x-4 items-center"
          >
            <a
              v-for="item in settings.nav"
              :key="item.href"
              :href="item.href ?? '/'"
              :class="btnClass"
              v-html="item.name"
            />
          </div>

          <div
            class="mr-4 hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center"
          >
            <NavAccount v-if="activeUser" :menu="accountMenu()" />
            <template v-else>
              <a href="/auth/login" :class="btnClass">Log In</a>
              <ElUi
                ui="button"
                btn="primary"
                href="/auth/register"
              >
                Sign Up
              </ElUi>
            </template>
            <div
              id="google-signin-prompt"
              class="absolute right-0 top-full"
            />
          </div>
        </nav>
      </div>
    </div>
    <!-- Mobile Nav -->
    <NavMobile v-model:vis="vis" :settings="settings" />
  </div>
</template>
@factor/api/plugin-user/google

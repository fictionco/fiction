<script setup lang="ts">
import type { ActionItem, MediaDisplayObject, NavItem } from '@fiction/core'
import { getNavComponentType, useService, vue } from '@fiction/core'
import { googleOneTap } from '@fiction/core/plugin-user/google'
import type { Card } from '@fiction/site/card'
import ElImage from '@fiction/ui/ElImage.vue'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import XElement from '@fiction/cards/CardElement.vue'
import NavMobile from './NavMobile.vue'
import NavAccount from './NavAccount.vue'

export type UserConfig = {
  icon?: string
  nav?: NavItem[]
  logo?: MediaDisplayObject
  actions?: ActionItem[]
  socialList?: NavItem[]
}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const { fictionUser, fictionRouter } = useService()

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const nav = vue.computed(() => {
  const currentRoute = fictionRouter.current.value.path
  return (uc.value.nav || []).map((item) => {
    const isActive = item.href === currentRoute
    return { ...item, isActive }
  })
})

const activeUser = fictionUser.activeUser
/* Nav visibility */
const vis = vue.ref(false)

const btnClass = `hover:bg-theme-200 dark:hover:bg-primary-950 cursor-pointer rounded-full px-4 py-1.5 text-sm font-sans font-semibold `

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized({ caller: 'ElHeader' })

  if (!user) {
    await googleOneTap({
      promptParentId: 'google-signin-prompt',
      fictionUser,
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

const accountMenu = vue.computed((): NavItem[] => {
  const p = fictionRouter.current.value.path
  const user = activeUser.value
  const list = [
    {
      name: user ? 'Dashboard' : 'Sign In',
      icon: 'i-tabler-user',
      href: props.card.link('/app?reload=1'),
    },
  ]

  if (user) {
    list.push({
      name: 'Sign Out',
      icon: 'i-tabler-logout',
      href: '/app/auth/logout',
    })
  }

  return list.map(item => ({ ...item, isActive: item.href === p }))
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
          <div class="flex lg:flex-1 text-left">
            <RouterLink
              to="/"
              class="hover:text-primary-600 x-font-title block rounded-md text-2xl font-bold transition-all max-w-[30dvw]"
            >
              <ElImage :media="uc.logo" class="h-6 inline-block" />
            </RouterLink>
          </div>
          <div class="flex lg:hidden items-center cursor-pointer hover:opacity-90 active:opacity-60" @click.stop="vis = !vis">
            <ElAvatar v-if="fictionUser?.activeUser.value?.email" class="mr-3 h-7 w-7 rounded-full" :email="fictionUser?.activeUser.value?.email" />
            <button
              type="button"
              class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
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
          <div>
            <component
              :is="getNavComponentType(item)"
              v-for="item in nav"
              :key="item.href"
              :to="item.href ?? '/'"
              :href="item.href ?? '/'"
              :class="[btnClass, item.isActive ? 'opacity-60' : '']"
              v-html="item.name"
            />
          </div>
          <div
            class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center"
          >
            <NavAccount v-if="activeUser" :card="card" :account-menu="accountMenu" />
            <template v-else>
              <XElement
                :card="card"
                theme-el="button"
                btn="default"
                href="/app/auth/login?reload=1"
              >
                Login
              </XElement>
              <XElement
                :card="card"
                theme-el="button"
                btn="primary"
                href="/app/auth/register?reload=1"
              >
                Sign Up
              </XElement>
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
    <NavMobile v-model:vis="vis" :card="card" :account-menu="accountMenu" />
  </div>
</template>

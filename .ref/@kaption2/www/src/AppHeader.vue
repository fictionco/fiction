<script lang="ts" setup>
import { onBrowserEvent, resetUi, vue } from '@factor/api'

import ElAvatar from '@factor/ui/ElAvatar.vue'
import KaptionLogo from '@kaption/core/ui/KaptionLogo.vue'

import { googleOneTap } from '@factor/api/plugin-auth/google'
import AppNavDesktop from './AppNavDesktop.vue'
import AppNavMobile from './AppNavMobile.vue'
import { darkMode, getDashboardUrl } from './util'

import { useSiteService } from './inject'

const { factorUser, factorRouter } = useSiteService()
const activeUser = factorUser.activeUser
vue.onMounted(async () => {
  const user = await factorUser.userInitialized()

  if (!user) {
    await googleOneTap({
      promptParentId: 'google-signin-prompt',
      factorUser,
      cookieDomain: 'kaption.co',
    })
  }
})

/* Nav visibility */
const vis = vue.ref(false)
const scrolled = vue.ref(false)

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

function toggleVisibility(): void {
  if (vis.value) {
    vis.value = false
  }
  else {
    resetUi()
    vis.value = true
  }
}
</script>

<template>
  <header class="absolute z-30 w-full overflow-y-visible">
    <a
      class="from-primary-700 via-primary-600 to-primary-700 hover:bg-primary-500 block bg-gradient-to-r py-2 text-center text-xs font-bold"
      href="mailto:hello@kaption.co"
      target="_blank"
    >
      <div
        class="m-auto max-w-7xl justify-center space-x-4 px-8 text-white md:flex"
      >
        <span class="space-x-2"><div class="block md:inline">Have a question?</div>
          <span class="underline">Email Us at hello@kaption.co &rarr;</span></span>
      </div>
    </a>
    <div
      class="mx-auto max-w-7xl rounded-md py-2 lg:py-6"
      :class="scrolled ? '' : ''"
    >
      <div class="px-4 lg:px-6">
        <nav
          class="relative flex items-center justify-between sm:h-10 lg:justify-center"
          aria-label="Global"
        >
          <div
            class="flex flex-1 items-center lg:absolute lg:inset-y-0 lg:left-0 lg:flex-none"
          >
            <div class="flex w-full items-center justify-between lg:w-auto">
              <RouterLink to="/" class="hidden lg:block">
                <KaptionLogo
                  :class="darkMode ? 'scheme-light' : 'scheme-standard'"
                  mode="logo"
                  class="h-6 w-auto"
                />
              </RouterLink>
              <button
                id="main-menu"
                type="button"
                class="focus:ring-primary-500 inline-flex w-20 items-center justify-start rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset lg:hidden"
                :class="
                  darkMode
                    ? 'text-white hover:text-theme-300 focus:text-white focus:bg-transparent'
                    : 'text-theme-500 hover:text-primary-500 focus:text-primary-500 focus:bg-transparent'
                "
                aria-haspopup="true"
                aria-expanded="true"
                @click.prevent.stop="toggleVisibility()"
              >
                <span class="sr-only">Open main menu</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
              <div class="logo-area block text-center lg:hidden">
                <RouterLink to="/">
                  <KaptionLogo
                    :class="darkMode ? 'scheme-light' : 'scheme-standard'"
                    class="h-5 w-auto"
                  />
                </RouterLink>
              </div>
              <a
                :href="getDashboardUrl('/login')"
                class="inline-flex w-20 justify-end text-sm font-medium lg:hidden"
                :class="
                  darkMode
                    ? 'text-white hover:text-theme-300'
                    : 'text-theme-500 hover:text-primary-500'
                "
              >
                <ElAvatar
                  v-if="activeUser"
                  class="ml-3 h-8 w-8 rounded-full"
                  :email="activeUser.email"
                />
                <span v-else class="whitespace-nowrap text-sm font-bold">Sign up &rarr;</span>
              </a>
            </div>
          </div>
          <div class="hidden items-center space-x-5 lg:flex">
            <AppNavDesktop />
          </div>
          <ul
            class="hidden transition-all lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:items-center lg:justify-end"
            :class="
              factorRouter.loadingRoute.value ? 'opacity-0' : 'opacity-100'
            "
          >
            <li class="ml-6">
              <a
                :href="getDashboardUrl('/login')"
                class="flex items-center font-semibold"
                :class="
                  darkMode
                    ? 'text-white hover:text-primary-200'
                    : 'text-primary-500 hover:text-primary-800'
                "
              >
                <span v-if="activeUser" class="inline-flex items-center">
                  <span>View Dashboard</span>
                  <ElAvatar
                    class="ml-3 h-8 w-8 rounded-full"
                    :email="activeUser.email"
                  />
                </span>
                <span v-else>Sign In &rarr;</span></a>
            </li>
          </ul>
          <div
            id="google-signin-prompt"
            class="absolute right-0 top-full"
          />
        </nav>
      </div>

      <!-- Mobile Nav -->
      <AppNavMobile v-model:vis="vis" />
    </div>
  </header>
</template>

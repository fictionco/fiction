<script setup lang="ts">
import type { FactorRouter, FactorUser } from '@factor/api'
import { useMeta, useService, vue } from '@factor/api'
import { googleOneTap } from '@factor/api/plugin-user/google'
import { getDashboardUrl } from '@fiction/core/util'
import ElIcon from '@pagelines/core/ui/ElIcon.vue'
import type { PageLinesTag } from '@pagelines/core/plugin-tag'
import { accountMenu, getNav } from './nav'
import NavMobile from './NavMobile.vue'
import NavAccount from './NavAccount.vue'

const { factorUser, factorRouter, pageLinesTag } = useService<{
  factorUser: FactorUser
  factorRouter: FactorRouter
  pageLinesTag: PageLinesTag
}>()
useMeta({
  script: vue.computed(() => {
    return [{ src: pageLinesTag.url('or64685818220b87550d830037').value, id: 'pl-agent', type: 'module' }]
  }),
})
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
          if (r.code) {
            location.href = getDashboardUrl({
              path: `/set-password`,
              queryArgs: {
                flow: 'register',
                code: r.code,
                email,
              },
            })
          }
          else {
            location.href = getDashboardUrl({
              path: `/org`,
              queryArgs: {
                flow: 'register',
                newUser: '1',
                email,
              },
            })
          }
        }
      },
    })
  }
})
</script>

<template>
  <div class="relative z-30">
    <div
      data-pl-agent-id="cb1443231434603664721"
      data-pl-mode="modal"
      data-pl-position="br"
      data-pl-trigger="button"
      class="hidden"
    />
    <div class="relative mx-auto max-w-screen-xl p-4 md:p-6 lg:px-8">
      <nav
        class="relative flex items-center justify-between"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <RouterLink to="/">
            <span class="sr-only">PageLines</span><ElIcon class="w-8" />
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

        <div class="mr-4 hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <RouterLink
            v-for="item in getNav({
              factorRouter,
              factorUser,
              location: 'header',
            }).value"
            :key="item.value"
            :to="item.value ?? '/'"
            :class="btnClass"
            @click="item.cb ? item.cb({ e: $event }) : null"
            v-html="item.name"
          />
          <NavAccount
            v-if="activeUser"
            :menu="accountMenu({ factorUser, factorRouter })"
          />
        </div>
      </nav>
      <div id="google-signin-prompt" class="absolute right-0 top-full" />
    </div>
  </div>
  <!-- Mobile Nav -->
  <NavMobile v-model:vis="vis" />
</template>
@factor/api/plugin-user/google

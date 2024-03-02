<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import { googleOneTap } from '@factor/api/plugin-user/google'
import { getDashboardUrl } from '@fiction/core/util'
import ElIcon from '@pagelines/core/ui/ElIcon.vue'
import { accountMenu, nav } from './nav'
import NavMobile from './NavMobile.vue'
import NavAccount from './NavAccount.vue'

const { factorUser } = useService<{ factorUser: FactorUser }>()

const activeUser = factorUser.activeUser
/* Nav visibility */
const vis = vue.ref(false)

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
              path: `/`,
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
      class="header mx-auto flex max-w-[1100px] items-end justify-between p-4"
    >
      <div class="logo col-span-4 flex items-center">
        <RouterLink to="/">
          <ElIcon class="w-8" />
        </RouterLink>
      </div>

      <div
        class="col-span-8 flex items-center justify-end text-right lg:hidden"
      >
        <NavAccount
          class="ml-4 lg:hidden"
          :menu="[...nav, ...accountMenu({ factorUser })]"
        />
      </div>
      <div
        class="nav col-span-8 hidden items-end justify-end space-x-8 font-serif text-xl lg:flex"
      >
        <RouterLink
          v-for="item in nav"
          :key="item.value"
          :to="item.value ?? '/'"
          class="hover:text-primary-500 border-theme-500 cursor-pointer px-3"
          @click="item.cb ? item.cb($event) : null"
        >
          {{ item.name }}
        </RouterLink>
        <NavAccount
          v-if="activeUser"
          :menu="accountMenu({ factorUser })"
        />

        <RouterLink
          v-else
          to="/login"
          class="hover:text-primary-500 cursor-pointer"
        >
          Login / Sign Up &rarr;
        </RouterLink>
      </div>
    </div>
    <div id="google-signin-prompt" class="absolute right-0 top-full" />
  </div>
  <!-- Mobile Nav -->
  <NavMobile v-model:vis="vis" />
</template>
